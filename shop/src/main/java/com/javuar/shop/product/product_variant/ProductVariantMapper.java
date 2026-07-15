package com.javuar.shop.product.product_variant;

import com.javuar.shop.product.product_variant_property_value_link.ProductVariantPropertyValueLinkMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductVariantMapper {
    private final ProductVariantPropertyValueLinkMapper productVariantPropertyValueLinkMapper;

    public ProductVariantResponseDTO toProductVariantResponseDTO(ProductVariant productVariant) {
        return ProductVariantResponseDTO.builder()
                .id(productVariant.getId())
                .quantity(productVariant.getQuantity())
                .price(productVariant.getPrice())
                .image(productVariant.getImageUrl())
                .productId(productVariant.getProduct().getId())
                .properties(productVariant.getProductVariantPropertyLinks().stream()
                        .map(productVariantPropertyValueLinkMapper::toProductVariantPropertyValueLinkDTO)
                        .toList())
                .build();
    }
}