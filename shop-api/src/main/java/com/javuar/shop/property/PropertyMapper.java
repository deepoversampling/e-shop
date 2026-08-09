package com.javuar.shop.property;

import com.javuar.shop.property.property_preset.PropertyPreset;
import com.javuar.shop.property.property_preset.PropertyPresetMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyMapper {
    private final PropertyPresetMapper propertyPresetMapper;

    public PropertyResponseDTO toPropertyResponseDTO(Property property) {
        return PropertyResponseDTO.builder()
                .id(property.getId())
                .name(property.getName())
                .unit(property.getUnit())
                .presets(property.getPropertyPresets().stream()
                        .map(propertyPresetMapper::toPropertyPresetDTO)
                        .toList())
                .build();
    }

    public Property toProperty(PropertyRequestDTO propertyRequestDTO) {
        Property property = Property.builder()
                .name(propertyRequestDTO.name())
                .unit(propertyRequestDTO.unit())
                .build();

        List<PropertyPreset> presets = propertyRequestDTO.presets().stream()
                .map(value -> PropertyPreset.builder()
                        .value(value)
                        .property(property)
                        .build())
                .toList();

        property.setPropertyPresets(presets);

        return property;
    }
}