package com.javuar.shop.product;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record ProductRequestDTO(
        @NotNull(message = "Category ID of the product cannot be null")
        Integer categoryId,

        @NotEmpty(message = "Product name cannot be empty")
        String name,

        @NotEmpty(message = "Product description cannot be empty")
        String description
) {}