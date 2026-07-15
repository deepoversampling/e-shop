package com.javuar.shop.product.product_variant;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.Map;

public record ProductVariantRequestDTO(
        @NotNull(message = "Product variant quantity cannot be null")
        Long quantity,

        @NotNull(message = "Product variant price cannot be null")
        BigDecimal price,

        @NotEmpty(message = "Product variant has to provide map of property IDs and property values")
        Map<Integer, String> properties
) {}