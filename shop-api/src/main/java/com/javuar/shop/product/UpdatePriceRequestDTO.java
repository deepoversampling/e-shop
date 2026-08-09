package com.javuar.shop.product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record UpdatePriceRequestDTO(
        @NotNull(message = "Price cannot be null")
        @Min(value = 0L, message = "Price must be at least 0")
        BigDecimal price
) {}