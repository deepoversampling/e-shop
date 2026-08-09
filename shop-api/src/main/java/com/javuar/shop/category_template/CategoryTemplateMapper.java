package com.javuar.shop.category_template;

import com.javuar.shop.property.PropertyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryTemplateMapper {
    private final PropertyMapper propertyMapper;

    public CategoryTemplateResponseDTO toCategoryTemplateResponseDTO(CategoryTemplate categoryTemplate) {
        return CategoryTemplateResponseDTO.builder()
                .id(categoryTemplate.getId())
                .categoryId(categoryTemplate.getCategory().getId())
                .properties(categoryTemplate.getProperties()
                        .stream()
                        .map(propertyMapper::toPropertyResponseDTO)
                        .toList()
                )
                .build();
    }
}