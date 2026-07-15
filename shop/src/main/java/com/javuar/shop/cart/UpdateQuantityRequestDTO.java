package com.javuar.shop.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateQuantityRequestDTO(
        @NotNull(message = "Quantity cannot be null")
        @Min(value = 1L, message = "Quantity must be at least 1")
        Long quantity
) {}