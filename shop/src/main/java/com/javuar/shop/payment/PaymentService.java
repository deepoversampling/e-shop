package com.javuar.shop.payment;

import com.javuar.shop.cart.Cart;
import com.javuar.shop.cart.CartRepository;
import com.javuar.shop.common.stripe.CustomerUtils;
import com.javuar.shop.common.stripe.LineItemBuilder;
import com.javuar.shop.exception.exceptions.cart.CartFinalizedException;
import com.javuar.shop.exception.exceptions.cart.CartNotFoundException;
import com.javuar.shop.exception.exceptions.cart.OutOfStockException;
import com.javuar.shop.exception.exceptions.cart.UnauthorizedCartActionException;
import com.javuar.shop.exception.exceptions.payment.StripeCustomerCreationException;
import com.javuar.shop.exception.exceptions.payment.StripeSessionCreationException;
import com.javuar.shop.exception.exceptions.product.ProductVariantNotFoundException;
import com.javuar.shop.exception.exceptions.user.UserNotFoundException;
import com.javuar.shop.user.User;
import com.javuar.shop.user.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import static com.javuar.shop.exception.BusinessErrorCodes.*;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    @Value("${application.frontend-base-url}")
    private String frontendBaseURL;

    @PreAuthorize("hasRole('USER')")
    public String startCartHostedCheckout(Integer cartId, Authentication authentication) {
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
                    String.format("Only the owner can modify the cart with the ID: %d", cartId)
            );
        }

        if (cart.isPaid()) {
            throw new CartFinalizedException(
                    CART_FINALIZED.name(),
                    CART_FINALIZED.getHttpStatus(),
                    String.format("Cart with the ID: %d has already been finalized and cannot be modified", cartId)
            );
        }

        cart.getItems().forEach(item -> {
                    if (!item.isPresent()) {
                        throw new ProductVariantNotFoundException(
                                PRODUCT_VARIANT_NOT_FOUND.name(),
                                PRODUCT_VARIANT_NOT_FOUND.getHttpStatus(),
                                String.format("Product variant with the name: %s was not found", item.getProductVariantSnapshot().getName())
                        );
                    } else if (!item.isAvailable()) {
                        throw new OutOfStockException(
                                OUT_OF_STOCK.name(),
                                OUT_OF_STOCK.getHttpStatus(),
                                String.format("Product with the ID: %d does not have enough quantity available", item.getProductVariant().getId())
                        );
                    }
                });

        User user = userRepository.findById(authentication.getName())
                .orElseThrow(() -> new UserNotFoundException(
                        USER_NOT_FOUND.name(),
                        USER_NOT_FOUND.getHttpStatus(),
                        String.format("User with the ID: %s was not found", authentication.getName())
                ));

        Customer customer;
        try {
            customer = CustomerUtils.findOrCreateCustomer(user.getEmail(), user.fullName());
        } catch (StripeException e) {
            throw new StripeCustomerCreationException(
                    STRIPE_CUSTOMER_CREATION.name(),
                    STRIPE_CUSTOMER_CREATION.getHttpStatus(),
                    String.format("Stripe failed to retrieve customer with the email: %s and full name: %s", user.getEmail(), user.fullName()),
                    e
            );
        }

        SessionCreateParams.Builder paramsBuilder =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setCustomer(customer.getId())
                        .setSuccessUrl(frontendBaseURL + "/success?session_id={CHECKOUT_SESSION_ID}")
                        .setCancelUrl(frontendBaseURL + "/failure")
                        .putMetadata("cart_id", cart.getId().toString());

        cart.getItems().forEach(item -> paramsBuilder.addLineItem(LineItemBuilder.build(item)));

        Session session;
        try {
            session = Session.create(paramsBuilder.build());
        } catch (StripeException e) {
            throw new StripeSessionCreationException(
                    STRIPE_SESSION_CREATION.name(),
                    STRIPE_SESSION_CREATION.getHttpStatus(),
                    "Stripe failed to create session",
                    e
            );
        }

        return session.getUrl();
    }
}