package com.javuar.shop.cart;

import com.javuar.shop.cart.item.*;
import com.javuar.shop.exception.exceptions.cart.*;
import com.javuar.shop.exception.exceptions.product.ProductVariantNotFoundException;
import com.javuar.shop.product.Product;
import com.javuar.shop.product.ProductRepository;
import com.javuar.shop.product.ProductResponseDTO;
import com.javuar.shop.product.product_variant.ProductVariant;
import com.javuar.shop.product.product_variant.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import static com.javuar.shop.common.cache.ClearOwnerProductsCache.*;
import static com.javuar.shop.exception.BusinessErrorCodes.*;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartMapper cartMapper;
    private final ItemRepository itemRepository;
    private final ItemMapper itemMapper;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final RedisTemplate<String, List<ProductResponseDTO>> productRedisTemplate;

    @PreAuthorize("hasRole('USER') && !hasRole('ADMIN')")
    @CacheEvict(value = "ownerCarts", key = "#authentication.name")
    public CartResponseDTO saveCart(Authentication authentication) {
        Cart cart = cartRepository.save(Cart.builder().build());

        return cartMapper.toCartResponseDTO(cart);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public CartResponseDTO fetchCartById(Integer cartId, Authentication authentication) {
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
                    String.format("Only the owner and admin can access the cart with the ID: %d", cartId)
            );
        }

        return cartMapper.toCartResponseDTO(cart);
    }

    @PreAuthorize("hasRole('USER')")
    @Cacheable(cacheNames = "ownerCarts", key = "#authentication.name")
    public List<CartResponseDTO> fetchCarts(Authentication authentication) {
        List<Cart> carts = cartRepository.findAllByCreatedBy(authentication.getName());

        // k -> Cart ID
        // v -> List of ItemDTOs
        Map<Integer, List<ItemResponseDTO>> itemDTOsMap = carts.stream()
                .flatMap(cart -> cart.getItems().stream()
                        .map(item -> new AbstractMap.SimpleEntry<>(
                                cart.getId(),
                                itemMapper.toItemResponseDTO(item)
                        )))
                .collect(Collectors.groupingBy(
                        Map.Entry::getKey,
                        Collectors.mapping(Map.Entry::getValue, Collectors.toList())
                ));

        return carts.stream()
                .map(cart -> cartMapper.toCartResponseDTO(
                        cart,
                        itemDTOsMap.getOrDefault(cart.getId(), new ArrayList<>())
                ))
                .toList();
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Transactional
    @CacheEvict(value = "ownerCarts", key = "#authentication.name")
    public void removeCartById(Integer cartId, Authentication authentication) {
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
                    String.format("Only the owner and admin can remove the cart with the ID: %d", cartId)
            );
        }

        if (cart.isPaid()) {
            throw new CartFinalizedException(
                    CART_FINALIZED.name(),
                    CART_FINALIZED.getHttpStatus(),
                    String.format("Cart with the ID: %d has already been finalized and cannot be removed", cartId)
            );
        }

        cartRepository.delete(cart);

        // Only present items can invalidate products cache
        Set<Integer> productIds = cart.getItems().stream()
                .filter(Item::isPresent)
                .map(item -> item.getProductVariantSnapshot().getProductId())
                .collect(Collectors.toSet());
        List<Product> products = productRepository.findByIdIn(productIds);
        products.forEach(product -> clearOwnerProductsCache(product.getCreatedBy(), productRedisTemplate));
    }

    @PreAuthorize("hasRole('USER') && !hasRole('ADMIN')")
    @Transactional
    @CacheEvict(value = "ownerCarts", key = "#authentication.name")
    public ItemResponseDTO saveItemToCart(Integer cartId, ItemRequestDTO itemRequestDTO, Authentication authentication) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException(
                        CART_NOT_FOUND.name(),
                        CART_NOT_FOUND.getHttpStatus(),
                        String.format("Cart with the ID: %d was not found", cartId)
                ));

        if (!cart.getCreatedBy().equals(authentication.getName())) {
            throw new UnauthorizedCartActionException(
                    UNAUTHORIZED_CART_ACTION.name(),
                    UNAUTHORIZED_CART_ACTION.getHttpStatus(),
                    String.format("Only the owner can add the item to the cart with the ID: %d", cartId)
            );
        }

        if (cart.isPaid()) {
            throw new CartFinalizedException(
                    CART_FINALIZED.name(),
                    CART_FINALIZED.getHttpStatus(),
                    String.format("Cart with the ID: %d has already been finalized and cannot be modified", cartId)
            );
        }

        boolean itemExistsAlready = cart.getItems().stream()
                .anyMatch(item ->
                        item.getProductVariant().getId().equals(itemRequestDTO.productVariantId()));

        if (itemExistsAlready) {
            throw new DuplicateItemException(
                    DUPLICATE_ITEM.name(),
                    DUPLICATE_ITEM.getHttpStatus(),
                    String.format("Cart with the ID: %d already has product variant with the ID: %d",
                            cartId, itemRequestDTO.productVariantId()
                    )
            );
        }

        ProductVariant productVariant = productVariantRepository.findById(itemRequestDTO.productVariantId())
                .orElseThrow(() -> new ProductVariantNotFoundException(
                        PRODUCT_VARIANT_NOT_FOUND.name(),
                        PRODUCT_VARIANT_NOT_FOUND.getHttpStatus(),
                        String.format("Product variant with the ID: %d was not found", itemRequestDTO.productVariantId())
                ));

        if (productVariant.getProduct().getCreatedBy().equals(authentication.getName())) {
            throw new SelfPurchaseNotAllowedException(
                    SELF_PURCHASE_NOT_ALLOWED.name(),
                    SELF_PURCHASE_NOT_ALLOWED.getHttpStatus(),
                    String.format("You cannot purchase your own product variant with ID: %d", productVariant.getId())
            );
        }

        if (!(productVariant.getQuantity() >= itemRequestDTO.quantity())) {
            throw new OutOfStockException(
                    OUT_OF_STOCK.name(),
                    OUT_OF_STOCK.getHttpStatus(),
                    String.format("Product variant with the ID: %d does not have enough quantity available", productVariant.getId())
            );
        }

        Item item = Item.builder()
                .cart(cart)
                .productVariant(productVariant)
                .productVariantSnapshot(ProductVariantSnapshot.from(productVariant))
                .quantity(itemRequestDTO.quantity())
                .build();

        item = itemRepository.save(item);
        cart.getItems().add(item);
        cartRepository.save(cart);

        // Clear owner products cache associated with the item (present only)
        if (item.isPresent()) {
            Optional<Product> product = productRepository.findProductById(item.getProductVariantSnapshot().getProductId());
            product.ifPresent((Product p) -> clearOwnerProductsCache(p.getCreatedBy(), productRedisTemplate));
        }

        return itemMapper.toItemResponseDTO(item);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Transactional
    @CacheEvict(value = "ownerCarts", key = "#authentication.name")
    public void removeItemByIdFromCart(Integer cartId, Integer itemId, Authentication authentication) {
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
                    String.format("Only the owner and admin can remove the item in the cart with the ID: %d", cartId)
            );
        }

        if (cart.isPaid()) {
            throw new CartFinalizedException(
                    CART_FINALIZED.name(),
                    CART_FINALIZED.getHttpStatus(),
                    String.format("Cart with the ID: %d has already been finalized and cannot be modified", cartId)
            );
        }

        // Item with a provided ID has to exist in the cart
        Item itemToRemove = cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ItemNotFoundException(
                        ITEM_NOT_FOUND.name(),
                        ITEM_NOT_FOUND.getHttpStatus(),
                        String.format("Item with the ID: %d was not found", itemId)
                ));

        cart.getItems().remove(itemToRemove);
        cartRepository.save(cart);

        if (itemToRemove.isPresent()) {
            Optional<Product> product = productRepository.findProductById(itemToRemove.getProductVariantSnapshot().getProductId());
            product.ifPresent((Product p) -> clearOwnerProductsCache(p.getCreatedBy(), productRedisTemplate));
        }
    }

    @PreAuthorize("hasRole('USER') && !hasRole('ADMIN')")
    @Transactional
    @CacheEvict(value = "ownerCarts", key = "#authentication.name")
    public void updateItemQuantity(Integer cartId, Integer itemId, UpdateQuantityRequestDTO quantityDTO, Authentication authentication) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException(
                        CART_NOT_FOUND.name(),
                        CART_NOT_FOUND.getHttpStatus(),
                        String.format("Cart with the ID: %d was not found", cartId)
                ));

        if (!cart.getCreatedBy().equals(authentication.getName())) {
            throw new UnauthorizedCartActionException(
                    UNAUTHORIZED_CART_ACTION.name(),
                    UNAUTHORIZED_CART_ACTION.getHttpStatus(),
                    String.format("Only the owner can modify quantity of the item in the cart with the ID: %d", cartId)
            );
        }

        if (cart.isPaid()) {
            throw new CartFinalizedException(
                    CART_FINALIZED.name(),
                    CART_FINALIZED.getHttpStatus(),
                    String.format("Cart with the ID: %d has already been finalized and cannot be modified", cartId)
            );
        }

        Item itemToUpdate = cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ItemNotFoundException(
                        ITEM_NOT_FOUND.name(),
                        ITEM_NOT_FOUND.getHttpStatus(),
                        String.format("Item with the ID: %d was not found", itemId)
                ));

        if (itemToUpdate.getQuantity().equals(quantityDTO.quantity())) {
            throw new QuantityUnchangedException(
                    QUANTITY_UNCHANGED.name(),
                    QUANTITY_UNCHANGED.getHttpStatus(),
                    String.format("Item with the ID: %d has already quantity: %d", itemId, quantityDTO.quantity())
            );
        }

        if (!itemToUpdate.isPresent()) {
            throw new ProductVariantNotFoundException(
                    PRODUCT_VARIANT_NOT_FOUND.name(),
                    PRODUCT_VARIANT_NOT_FOUND.getHttpStatus(),
                    String.format("Product variant with the name: %s was not found", itemToUpdate.getProductVariantSnapshot().getName())
            );
        } else if (!(itemToUpdate.getProductVariant().getQuantity() >= quantityDTO.quantity())) {
            throw new OutOfStockException(
                    OUT_OF_STOCK.name(),
                    OUT_OF_STOCK.getHttpStatus(),
                    String.format("Product with the ID: %d does not have enough quantity available", itemToUpdate.getProductVariant().getId())
            );
        } else {
            itemToUpdate.setQuantity(quantityDTO.quantity());
            cartRepository.save(cart);

            if (itemToUpdate.isPresent()) {
                Optional<Product> product = productRepository.findProductById(itemToUpdate.getProductVariantSnapshot().getProductId());
                product.ifPresent((Product p) -> clearOwnerProductsCache(p.getCreatedBy(), productRedisTemplate));
            }
        }
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ItemResponseDTO fetchItemById(Integer cartId, Integer itemId, Authentication authentication) {
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
                    String.format("Only the owner and admin can access the item in the cart with the ID: %d", cartId)
            );
        }

        return itemMapper.toItemResponseDTO(
                cart.getItems().stream()
                        .filter(item -> item.getId().equals(itemId))
                        .findFirst()
                        .orElseThrow(() -> new ItemNotFoundException(
                                ITEM_NOT_FOUND.name(),
                                ITEM_NOT_FOUND.getHttpStatus(),
                                String.format("Item with the ID: %d was not found", itemId)
                        ))
        );
    }
}