package com.javuar.shop.product.product_variant_property_value_link;

import org.springframework.stereotype.Service;

@Service
public class ProductVariantPropertyValueLinkMapper {

    public ProductVariantPropertyValueLinkDTO toProductVariantPropertyValueLinkDTO(ProductVariantPropertyValueLink productVariantPropertyValueLink) {
        return ProductVariantPropertyValueLinkDTO.builder()
                .propertyId(productVariantPropertyValueLink.getProperty().getId())
                .value(productVariantPropertyValueLink.getPropertyValue().getValue())
                .build();
    }
}