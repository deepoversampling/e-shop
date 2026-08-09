package com.javuar.shop.property;

import com.javuar.shop.common.utils.UriProperties;
import com.javuar.shop.common.utils.UriUtils;
import com.javuar.shop.property.validation.group_sequence.PropertyValidationSequence;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("properties")
@RequiredArgsConstructor
public class PropertyController {
    private final PropertyService propertyService;
    private final UriProperties uriProperties;

    @PostMapping
    public ResponseEntity<PropertyResponseDTO> createProperty(
            @Validated(PropertyValidationSequence.class) @RequestBody PropertyRequestDTO propertyRequestDTO
    ) {
        PropertyResponseDTO propertyResponseDTO = propertyService.saveProperty(propertyRequestDTO);
        URI location = UriUtils.createUri(
                uriProperties,
                "properties", propertyResponseDTO.getId()
        );

        return ResponseEntity.created(location).body(propertyResponseDTO);
    }

    @GetMapping("/{property-id}")
    public ResponseEntity<PropertyResponseDTO> getPropertyById(
            @PathVariable("property-id") Integer propertyId
    ) {
        return ResponseEntity.ok(propertyService.fetchPropertyById(propertyId));
    }

    @GetMapping
    public ResponseEntity<List<PropertyResponseDTO>> getProperties() {
        return ResponseEntity.ok(propertyService.fetchProperties());
    }

    @DeleteMapping("/{property-id}")
    public ResponseEntity<Void> deletePropertyById(
            @PathVariable("property-id") Integer propertyId
    ) {
        propertyService.removePropertyById(propertyId);
        return ResponseEntity.noContent().build();
    }
}