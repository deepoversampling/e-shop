package com.javuar.shop.category_template;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CategoryTemplateRequestDTO(
        @NotNull(message = "Category ID cannot be null")
        Integer categoryId,

        @NotEmpty(message = "Category template must define list of property IDs")
        List<Integer> propertyIds
) {}