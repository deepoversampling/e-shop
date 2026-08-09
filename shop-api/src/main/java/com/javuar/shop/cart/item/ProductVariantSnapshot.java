package com.javuar.shop.cart.item;

import com.javuar.shop.product.product_variant.ProductVariant;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
// Snapshot stores information from both product and product variant
public class ProductVariantSnapshot {
    private Integer productId;
    private Integer productVariantId;
    private LocalDateTime createdDate;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Map<Integer, String> properties;

    public static ProductVariantSnapshot from(ProductVariant variant) {

        // k -> Property ID
        // v -> Value of the property
        Map<Integer, String> properties = variant.getProductVariantPropertyLinks().stream()
                .collect(Collectors.toMap(
                        link -> link.getProperty().getId(),
                        link -> link.getPropertyValue().getValue()
                ));

        return ProductVariantSnapshot.builder()
                .productId(variant.getProduct().getId())
                .productVariantId(variant.getId())
                .createdDate(variant.getProduct().getCreatedDate())
                .name(variant.getProduct().getName())
                .description(variant.getProduct().getDescription())
                .price(variant.getPrice())
                .imageUrl(variant.getImageUrl())
                .properties(properties)
                .build();
    }
}