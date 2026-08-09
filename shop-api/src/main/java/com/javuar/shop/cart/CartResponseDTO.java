package com.javuar.shop.cart;

import com.javuar.shop.cart.item.ItemResponseDTO;
import lombok.Builder;

import java.util.List;

@Builder
public record CartResponseDTO(
        Integer id,
        boolean isPaid,
        List<ItemResponseDTO> items
) {}