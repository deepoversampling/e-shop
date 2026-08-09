package com.javuar.shop.product;

import com.javuar.shop.product.product_variant.ProductVariantResponseDTO;
import com.javuar.shop.product.product_variant_property_value_link.ProductVariantPropertyValueLinkDTO;
import com.javuar.shop.product.product_variant_property_value_link.ProductVariantPropertyValueLinkMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductMapper {
    private final ProductVariantPropertyValueLinkMapper productVariantPropertyValueLinkMapper;

    public ProductResponseDTO toProductResponseDTO(Product product) {
        // k -> ProductVariant ID
        // v -> List of ProductVariantPropertyValueLinkDTOs
        Map<Integer, List<ProductVariantPropertyValueLinkDTO>> productVariantPropertyValueLinkDTOs = product.getProductVariants().stream()
                .flatMap(variant -> variant.getProductVariantPropertyLinks().stream()
                        // Every link is transformed into map entry where key is variant ID and the value is link DTO
                        .map(link -> new AbstractMap.SimpleEntry<>(
                                variant.getId(),
                                productVariantPropertyValueLinkMapper.toProductVariantPropertyValueLinkDTO(link)
                        )))
                .collect(Collectors.groupingBy(
                        Map.Entry::getKey,
                        Collectors.mapping(Map.Entry::getValue, Collectors.toList())
                ));

        List<ProductVariantResponseDTO> productVariantResponseDTOs = product.getProductVariants().stream()
                .map(variant -> ProductVariantResponseDTO.builder()
                        .id(variant.getId())
                        .quantity(variant.getQuantity())
                        .price(variant.getPrice())
                        .image(variant.getImageUrl())
                        .productId(variant.getProduct().getId())
                        .properties(productVariantPropertyValueLinkDTOs.getOrDefault(variant.getId(), new ArrayList<>()))
                        .build())
                .toList();

        return ProductResponseDTO.builder()
                .id(product.getId())
                .categoryId(product.getCategory().getId())
                .variants(productVariantResponseDTOs)
                .name(product.getName())
                .description(product.getDescription())
                .rate(product.getRate())
                .build();
    }

    public ProductResponseDTO toProductResponseDTO(Product product, List<ProductVariantResponseDTO> productVariantResponseDTOS) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .categoryId(product.getCategory().getId())
                .variants(productVariantResponseDTOS)
                .name(product.getName())
                .description(product.getDescription())
                .rate(product.getRate())
                .build();
    }
}