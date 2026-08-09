package com.javuar.shop.product.product_variant;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.javuar.shop.product.product_variant_property_value_link.ProductVariantPropertyValueLinkDTO;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantResponseDTO {
    private Integer id;
    private Long quantity;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long demand;
    private BigDecimal price;
    private String image;
    private Integer productId;
    private List<ProductVariantPropertyValueLinkDTO> properties;
}
