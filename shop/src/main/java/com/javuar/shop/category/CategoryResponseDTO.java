package com.javuar.shop.category;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;
import java.util.stream.Collectors;

public record CategoryResponseDTO(
        Integer id,
        String name,
        @JsonInclude(JsonInclude.Include.NON_NULL)
        String icon,
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        List<CategoryResponseDTO> subcategories
) {
    public CategoryResponseDTO(Category category) {
        this(
                category.getId(),
                category.getName(),
                category.getIcon(),
                category.getSubcategories().stream()
                        .map(CategoryResponseDTO::new)
                        .collect(Collectors.toList())
        );
    }

    public CategoryResponseDTO(Integer id, String name, String icon, List<CategoryResponseDTO> subcategories) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.subcategories = subcategories;
    }
}