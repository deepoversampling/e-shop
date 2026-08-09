package com.javuar.shop.cart;

import com.javuar.shop.cart.item.ItemRequestDTO;
import com.javuar.shop.cart.item.ItemResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("carts")
@RequiredArgsConstructor
public class CartController {
    public final CartService cartService;

    @PostMapping
    public ResponseEntity<CartResponseDTO> createCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.saveCart(authentication));
    }

    @GetMapping("/{cart-id}")
    public ResponseEntity<CartResponseDTO> getCartById(
            @PathVariable("cart-id") Integer cartId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(cartService.fetchCartById(cartId, authentication));
    }

    @GetMapping
    public ResponseEntity<List<CartResponseDTO>> getCarts(
            Authentication authentication
    ) {
        return ResponseEntity.ok(cartService.fetchCarts(authentication));
    }

    @DeleteMapping("/{cart-id}")
    public ResponseEntity<Void> deleteCartById(
            @PathVariable("cart-id") Integer cartId,
            Authentication authentication
    ) {
        cartService.removeCartById(cartId, authentication);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{cart-id}/items")
    public ResponseEntity<ItemResponseDTO> addItem(
            @PathVariable("cart-id") Integer cartId,
            @Valid @RequestBody ItemRequestDTO itemRequestDTO,
            Authentication authentication
    ) {
        return ResponseEntity.ok(cartService.saveItemToCart(cartId, itemRequestDTO, authentication));
    }

    @GetMapping("/{cart-id}/items/{item-id}")
    public ResponseEntity<ItemResponseDTO> getItemById(
            @PathVariable("cart-id") Integer cartId,
            @PathVariable("item-id") Integer itemId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(cartService.fetchItemById(cartId, itemId, authentication));
    }

    @DeleteMapping("/{cart-id}/items/{item-id}")
    public ResponseEntity<Void> deleteItemById(
            @PathVariable("cart-id") Integer cartId,
            @PathVariable("item-id") Integer itemId,
            Authentication authentication
    ) {
        cartService.removeItemByIdFromCart(cartId, itemId, authentication);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{cart-id}/items/{item-id}/quantity")
    public ResponseEntity<Void> patchItemQuantityById(
            @PathVariable("cart-id") Integer cardId,
            @PathVariable("item-id") Integer itemId,
            @Valid @RequestBody UpdateQuantityRequestDTO quantity,
            Authentication authentication
    ) {
        cartService.updateItemQuantity(cardId, itemId, quantity, authentication);
        return ResponseEntity.ok().build();
    }
}