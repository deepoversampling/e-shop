package com.javuar.shop.category_template;

import com.javuar.shop.property.PropertyResponseDTO;
import lombok.Builder;

import java.util.List;

@Builder
public record CategoryTemplateResponseDTO(
        Integer id,
        Integer categoryId,
        List<PropertyResponseDTO> properties
        ) {}