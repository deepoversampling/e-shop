package com.javuar.shop.cart.item;

import lombok.*;

@Builder
public record ItemResponseDTO(
        Integer id,
        Long quantity,
        ProductVariantSnapshot productSnapshot,
        boolean present,
        boolean available
) {}