package com.javuar.shop.property;

import com.javuar.shop.property.validation.PropertyPresetsConstraint;
import com.javuar.shop.property.validation.group_sequence.CustomGroup;
import com.javuar.shop.property.validation.group_sequence.DefaultGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record PropertyRequestDTO(
        @NotBlank(message = "Property name cannot be empty", groups = DefaultGroup.class)
        String name,

        String unit,

        @PropertyPresetsConstraint(groups = CustomGroup.class)
        @NotEmpty(message = "Property must define list of presets", groups = DefaultGroup.class)
        // e.g. "wood", "metal", "plastic or "1-3", "4-6", "7-12"
        List<String> presets
) {}