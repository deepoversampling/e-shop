package com.javuar.shop.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/{cart-id}/checkout/hosted")
    public ResponseEntity<CheckoutResponseDto> hostedCheckout(
            @PathVariable("cart-id") Integer cartId,
            Authentication authentication
    ) {
        String checkoutUrl = paymentService.startCartHostedCheckout(cartId, authentication);
        return ResponseEntity.ok(new CheckoutResponseDto(checkoutUrl));
    }
}