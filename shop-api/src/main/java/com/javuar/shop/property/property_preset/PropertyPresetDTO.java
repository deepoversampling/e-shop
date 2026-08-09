package com.javuar.shop.property.property_preset;

import lombok.Builder;

@Builder
public record PropertyPresetDTO(
        Integer id,
        String value
) {}
