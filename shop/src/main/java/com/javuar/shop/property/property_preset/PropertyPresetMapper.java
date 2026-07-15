package com.javuar.shop.property.property_preset;

import org.springframework.stereotype.Service;

@Service
public class PropertyPresetMapper {

    public PropertyPresetDTO toPropertyPresetDTO(PropertyPreset propertyPreset) {
        return PropertyPresetDTO.builder()
                .id(propertyPreset.getId())
                .value(propertyPreset.getValue())
                .build();
    }
}