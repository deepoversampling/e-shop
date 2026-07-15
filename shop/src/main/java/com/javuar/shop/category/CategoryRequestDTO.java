package com.javuar.shop.category;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequestDTO(
        @NotBlank(message = "Category name cannot be blank")
        String name,
        String icon,
        Integer parentId
) {}