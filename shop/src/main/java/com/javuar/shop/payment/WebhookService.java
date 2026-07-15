package com.javuar.shop.payment;

import com.javuar.shop.cart.CartRepository;
import com.javuar.shop.cart.CartResponseDTO;
import com.javuar.shop.cart.item.ItemRepository;
import com.javuar.shop.config.stripe.StripeProperties;
import com.javuar.shop.exception.exceptions.payment.InvalidStripeSignatureException;
import com.javuar.shop.product.ProductResponseDTO;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static com.javuar.shop.common.cache.ClearOwnerCartsCache.*;
import static com.javuar.shop.common.cache.ClearOwnerProductsCache.*;
import static com.javuar.shop.exception.BusinessErrorCodes.INVALID_STRIPE_SIGNATURE;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookService {
    private final CartRepository cartRepository;
    private final StripeProperties stripeProperties;
    private final RedisTemplate<String, List<CartResponseDTO>> cartRedisTemplate;
    private final RedisTemplate<String, List<ProductResponseDTO>> productRedisTemplate;
    private final ItemRepository itemRepository;

    public void handleCheckoutSessionCompleted(String payload, String sigHeader) {
        String endpointSecret = stripeProperties.getEndpointSecret();

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            throw new InvalidStripeSignatureException(
                    INVALID_STRIPE_SIGNATURE.name(),
                    INVALID_STRIPE_SIGNATURE.getHttpStatus(),
                    "Invalid Stripe signature",
                    e
            );
        }

        if ("checkout.session.completed".equals(event.getType())) {
            EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();

            if (deserializer.getObject().isPresent()) {
                StripeObject stripeObject = deserializer.getObject().get();

                // Pattern matching for instanceof
                if (stripeObject instanceof Session session) {
                    String cartId = session.getMetadata().get("cart_id");

                    if (cartId != null) {
                        cartRepository.findById(Integer.valueOf(cartId))
                                .ifPresent(cart -> {
                                    // Owners of the bought product variants
                                    Set<String> productOwners = new HashSet<>();
                                    // Owners of the carts which have product variants bought by the user which makes checkout, including this user
                                    Set<String> cartOwners = new HashSet<>(Set.of(cart.getCreatedBy()));
                                    cart.getItems().forEach(item -> {
                                        item.getProductVariant().setQuantity(item.getProductVariant().getQuantity() - item.getQuantity());
                                        productOwners.add(item.getProductVariant().getProduct().getCreatedBy());
                                        itemRepository.findAllByProductVariant_Id(item.getProductVariant().getId())
                                                .forEach(itemCartOwner -> cartOwners.add(itemCartOwner.getCart().getCreatedBy()));
                                    });
                                    cart.setPaid(true);
                                    cartRepository.save(cart);
                                    productOwners.forEach(owner -> clearOwnerProductsCache(owner, productRedisTemplate));
                                    cartOwners.forEach(owner -> clearOwnerCartsCache(owner, cartRedisTemplate));
                                });
                    }
                } else {
                    log.warn("Expected Stripe session, but got {}", stripeObject.getClass().getSimpleName());
                }
            } else {
                log.warn("Session deserialization failed — possibly due to Stripe API version mismatch");
            }
        }
    }

}