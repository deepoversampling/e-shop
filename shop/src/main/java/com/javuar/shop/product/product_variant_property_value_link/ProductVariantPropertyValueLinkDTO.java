package com.javuar.shop.product.product_variant_property_value_link;

import lombok.Builder;

@Builder
public record ProductVariantPropertyValueLinkDTO(
        Integer propertyId,
        String value
) {}