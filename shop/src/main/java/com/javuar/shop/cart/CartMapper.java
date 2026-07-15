package com.javuar.shop.cart;

import com.javuar.shop.cart.item.ItemMapper;
import com.javuar.shop.cart.item.ItemResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartMapper {
    private final ItemMapper itemMapper;

    public CartResponseDTO toCartResponseDTO(Cart cart) {
        List<ItemResponseDTO> itemResponseDTOS = cart.getItems().stream()
                .map(itemMapper::toItemResponseDTO)
                .toList();

        return CartResponseDTO.builder()
                .id(cart.getId())
                .isPaid(cart.isPaid())
                .items(itemResponseDTOS)
                .build();
    }

    public CartResponseDTO toCartResponseDTO(Cart cart, List<ItemResponseDTO> itemResponseDTOS) {
        return CartResponseDTO.builder()
                .id(cart.getId())
                .isPaid(cart.isPaid())
                .items(itemResponseDTOS)
                .build();
    }
}