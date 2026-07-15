package com.javuar.shop.property;

import com.javuar.shop.exception.exceptions.property.DuplicatePropertyNameException;
import com.javuar.shop.exception.exceptions.property.PropertyNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.javuar.shop.exception.BusinessErrorCodes.DUPLICATE_PROPERTY_NAME;
import static com.javuar.shop.exception.BusinessErrorCodes.PROPERTY_NOT_FOUND;

@Service
@RequiredArgsConstructor
@EnableMethodSecurity
public class PropertyService {
    private final PropertyRepository propertyRepository;
    private final PropertyMapper propertyMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public PropertyResponseDTO saveProperty(PropertyRequestDTO propertyRequestDTO) {
        if (propertyRepository.findByName(propertyRequestDTO.name())
                .isPresent()) {
            throw new DuplicatePropertyNameException(
                    DUPLICATE_PROPERTY_NAME.name(),
                    DUPLICATE_PROPERTY_NAME.getHttpStatus(),
                    String.format("Property with the name: %s already exists", propertyRequestDTO.name())
            );
        }
        Property newProperty = propertyMapper.toProperty(propertyRequestDTO);

        return propertyMapper.toPropertyResponseDTO(propertyRepository.save(newProperty));
    }

    @Cacheable(cacheNames = "property", key = "#propertyId")
    public PropertyResponseDTO fetchPropertyById(Integer propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException(
                        PROPERTY_NOT_FOUND.name(),
                        PROPERTY_NOT_FOUND.getHttpStatus(),
                        String.format("Property with the ID: %d was not found", propertyId)
                ));

        return propertyMapper.toPropertyResponseDTO(property);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @CacheEvict(cacheNames = "property", key = "#propertyId")
    public void removePropertyById(Integer propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException(
                        PROPERTY_NOT_FOUND.name(),
                        PROPERTY_NOT_FOUND.getHttpStatus(),
                        String.format("Property with the ID: %d was not found", propertyId)
                ));
        propertyRepository.delete(property);
    }

    public List<PropertyResponseDTO> fetchProperties() {
        return propertyRepository.findAll().stream()
                .map(propertyMapper::toPropertyResponseDTO)
                .toList();
    }

}