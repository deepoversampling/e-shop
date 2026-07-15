package com.javuar.shop.product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateQuantityRequestDTO(
        @NotNull(message = "Quantity cannot be null")
        @Min(value = 0L, message = "Quantity must be at least 0")
        Long quantity
) {}