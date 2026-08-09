package com.javuar.shop.feedback;

import com.javuar.shop.cart.Cart;
import com.javuar.shop.cart.CartRepository;
import com.javuar.shop.cart.item.Item;
import com.javuar.shop.cart.item.ItemRepository;
import com.javuar.shop.common.pagination.PageResponse;
import com.javuar.shop.common.sort.SortUtils;
import com.javuar.shop.exception.exceptions.cart.CartNotFoundException;
import com.javuar.shop.exception.exceptions.cart.ItemNotFoundException;
import com.javuar.shop.exception.exceptions.cart.UnauthorizedCartActionException;
import com.javuar.shop.exception.exceptions.feedback.UnauthorizedFeedbackActionException;
import com.javuar.shop.exception.exceptions.product.ProductNotFoundException;
import com.javuar.shop.product.ProductRepository;
import com.javuar.shop.product.product_variant.ProductVariant;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.javuar.shop.common.cache.ClearProductFeedbacksCache.*;
import static com.javuar.shop.common.cache.ClearCartFeedbacksCache.*;
import static com.javuar.shop.exception.BusinessErrorCodes.*;

@Service
@RequiredArgsConstructor
@EnableMethodSecurity
public class FeedbackService {
    private final ProductRepository productRepository;
    private final FeedbackRepository feedbackRepository;
    private final FeedbackMapper feedbackMapper;
    private final CartRepository cartRepository;
    private final ItemRepository itemRepository;
    private final RedisTemplate<String, PageResponse<FeedbackResponseDTO>> feedbackRedisTemplate;
    private final RedisTemplate<String, List<FeedbackResponseDTO>> carFeedbackstRedisTemplate;

    @PreAuthorize("hasRole('USER') && !hasRole('ADMIN')")
    public FeedbackResponseDTO saveFeedback(FeedbackRequestDTO feedbackRequestDTO, Authentication authentication) {
        Item item = itemRepository.findById(feedbackRequestDTO.itemId())
                .orElseThrow(() -> new ItemNotFoundException(
                        ITEM_NOT_FOUND.name(),
                        ITEM_NOT_FOUND.getHttpStatus(),
                        String.format("Item with the ID: %d was not found", feedbackRequestDTO.itemId())
                ));

        Cart cart = item.getCart();

        if (!cart.getCreatedBy().equals(authentication.getName())) {
            throw new UnauthorizedFeedbackActionException(
                    UNAUTHORIZED_FEEDBACK_ACTION.name(),
                    UNAUTHORIZED_FEEDBACK_ACTION.getHttpStatus(),
                    "You are not authorized to leave feedback for this product"
            );
        }

        if (!cart.isPaid()) {
            throw new UnauthorizedFeedbackActionException(
                    UNAUTHORIZED_FEEDBACK_ACTION.name(),
                    UNAUTHORIZED_FEEDBACK_ACTION.getHttpStatus(),
                    String.format("Cart with the ID: %d has not been finalized yet", cart.getId())
            );
        }

        ProductVariant productVariant = item.getProductVariant();

        // Checks is the feedback has been commited, (the cart can have only 1 item of particular product variant)
        // It checks if this particular cart is a part of any feedback from this product variant
        boolean hasFeedback = productVariant.getFeedbacks().stream()
                .anyMatch(feedback -> feedback.getCart().getId().equals(cart.getId()));

        if (hasFeedback) {
            throw new UnauthorizedFeedbackActionException(
                    UNAUTHORIZED_FEEDBACK_ACTION.name(),
                    UNAUTHORIZED_FEEDBACK_ACTION.getHttpStatus(),
                    "You have already left feedback for this product"
            );
        }

        Feedback feedback = Feedback.builder()
                .note(feedbackRequestDTO.note())
                .comment(feedbackRequestDTO.comment())
                .product(productVariant.getProduct())
                .productVariant(productVariant)
                .cart(cart)
                .build();

        feedback = feedbackRepository.save(feedback);
        clearProductFeedbacksCache(productVariant.getProduct().getId(), feedbackRedisTemplate);
        clearCartFeedbacksCache(cart.getId(), carFeedbackstRedisTemplate);

        return feedbackMapper.toFeedbackResponseDTO(feedback);
    }

    @Cacheable(
            cacheNames = "productFeedbacks",
            key = "#productId + '_' + #pageNumber + '_' + #pageSize + '_' + #sortBy + '_' + #direction"
    )
    public PageResponse<FeedbackResponseDTO> fetchFeedbacksByProductId(
            int pageNumber, int pageSize,
            String sortBy, String direction, Integer productId
    ) {
        productRepository.findProductById(productId)
                .orElseThrow(() -> new ProductNotFoundException(
                        PRODUCT_NOT_FOUND.name(),
                        PRODUCT_NOT_FOUND.getHttpStatus(),
                        String.format("Product with the ID: %d was not found", productId)
                ));

        Pageable pageable = SortUtils.createPageable("feedback", pageNumber, pageSize, sortBy, direction);

        Page<Feedback> feedbacks = feedbackRepository.findAllByProduct_Id(productId, pageable);

        List<FeedbackResponseDTO> feedbackResponseDTOs = feedbacks.stream()
                .map(feedbackMapper::toFeedbackResponseDTO)
                .toList();

        return new PageResponse<>(
                feedbackResponseDTOs,
                feedbacks.getNumber(),
                feedbacks.getSize(),
                feedbacks.getTotalElements(),
                feedbacks.getTotalPages(),
                feedbacks.isFirst(),
                feedbacks.isLast()
        );
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public List<Integer> fetchPendingFeedbacksByCartId(Integer cartId, Authentication authentication) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException(
                        CART_NOT_FOUND.name(),
                        CART_NOT_FOUND.getHttpStatus(),
                        String.format("Cart with the ID: %d was not found", cartId)
                ));

        if (!cart.getCreatedBy().equals(authentication.getName())
                && !authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            throw new UnauthorizedCartActionException(
                    UNAUTHORIZED_CART_ACTION.name(),
                    UNAUTHORIZED_CART_ACTION.getHttpStatus(),
                    String.format("Only the owner and admin can access the pending feedbacks of the cart with the ID: %d", cartId)
            );
        }

        if (!cart.isPaid()) {
            throw new UnauthorizedFeedbackActionException(
                    UNAUTHORIZED_FEEDBACK_ACTION.name(),
                    UNAUTHORIZED_FEEDBACK_ACTION.getHttpStatus(),
                    String.format("Cart with the ID: %d has not been finalized yet", cart.getId())
            );
        }

        return cart.getItems().stream()
                .filter(item -> {
                    ProductVariant productVariant = item.getProductVariant();
                    return productVariant.getFeedbacks().stream()
                            .noneMatch(feedback -> feedback.getCart().getId().equals(cartId));
                })
                .map(Item::getId)
                .toList();
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Cacheable(cacheNames = "cartFeedbacks", key = "#cartId"
    )
    public List<FeedbackResponseDTO> fetchFeedbacksByCartId(Integer cartId, Authentication authentication) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException(
                        CART_NOT_FOUND.name(),
                        CART_NOT_FOUND.getHttpStatus(),
                        String.format("Cart with the ID: %d was not found", cartId)
                ));

        if (!cart.getCreatedBy().equals(authentication.getName())
                && !authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            throw new UnauthorizedCartActionException(
                    UNAUTHORIZED_CART_ACTION.name(),
                    UNAUTHORIZED_CART_ACTION.getHttpStatus(),
                    String.format("Only the owner and admin can access the feedbacks of the cart with the ID: %d", cartId)
            );
        }

        if (!cart.isPaid()) {
            throw new UnauthorizedFeedbackActionException(
                    UNAUTHORIZED_FEEDBACK_ACTION.name(),
                    UNAUTHORIZED_FEEDBACK_ACTION.getHttpStatus(),
                    String.format("Cart with the ID: %d has not been finalized yet", cart.getId())
            );
        }

        if (!cart.getCreatedBy().equals(authentication.getName())) {
            throw new UnauthorizedCartActionException(
                    UNAUTHORIZED_CART_ACTION.name(),
                    UNAUTHORIZED_CART_ACTION.getHttpStatus(),
                    String.format("Only the owner can modify the cart with the ID: %d", cartId)
            );
        }

        List<Feedback> feedbacks = feedbackRepository.findAllByCart_Id(cartId);

        return feedbacks.stream()
                .map(feedbackMapper::toFeedbackResponseDTO)
                .toList();
    }
}