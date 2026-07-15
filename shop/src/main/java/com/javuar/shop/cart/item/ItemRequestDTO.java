package com.javuar.shop.cart.item;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ItemRequestDTO(
        @NotNull(message = "ID of the product variant cannot be null")
        Integer productVariantId,

        @NotNull(message = "Quantity of the product variant cannot be null")
        @Min(value = 1L, message = "Quantity must be at least 1")
        Long quantity
) {}