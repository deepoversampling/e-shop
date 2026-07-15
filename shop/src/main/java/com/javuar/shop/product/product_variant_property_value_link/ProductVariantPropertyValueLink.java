package com.javuar.shop.product.product_variant_property_value_link;

import com.javuar.shop.product.product_variant.ProductVariant;
import com.javuar.shop.product.product_variant_property_value_link.property_value.PropertyValue;
import com.javuar.shop.property.Property;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
// Bridge table between product variants, properties and property values
public class ProductVariantPropertyValueLink {
    @Id
    @GeneratedValue
    private Integer id;

    // Single-valued association with (N:1) multiplicity
    // Owning side of the bidirectional relationship
    @ManyToOne
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    // Single-valued association with (N:1) multiplicity
    // Owning side of the unidirectional relationship
    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;

    // Single-valued association with (N:1) multiplicity
    // Owning side of the unidirectional relationship
    @ManyToOne
    @JoinColumn(name = "property_value_id")
    private PropertyValue propertyValue;
}