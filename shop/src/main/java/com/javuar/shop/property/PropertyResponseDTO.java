package com.javuar.shop.property;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.javuar.shop.property.property_preset.PropertyPresetDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyResponseDTO {
    private Integer id;
    private String name;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String unit;

    private List<PropertyPresetDTO> presets;
}