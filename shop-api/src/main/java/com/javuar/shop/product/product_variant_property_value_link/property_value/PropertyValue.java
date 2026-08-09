package com.javuar.shop.product.product_variant_property_value_link.property_value;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class PropertyValue {
    @Id
    @GeneratedValue
    private Integer id;

    @Column(nullable = false)
    private String value;
}
