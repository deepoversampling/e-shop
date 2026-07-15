package com.javuar.shop.product;

import com.javuar.shop.product.product_variant.ProductVariantResponseDTO;
import lombok.Builder;

import java.util.List;

@Builder
public record ProductResponseDTO(
        Integer id,
        Integer categoryId,
        List<ProductVariantResponseDTO> variants,
        String name,
        String description,
        Double rate
) {}