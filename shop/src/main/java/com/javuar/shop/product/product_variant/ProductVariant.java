package com.javuar.shop.product.product_variant;

import com.javuar.shop.feedback.Feedback;
import com.javuar.shop.product.Product;
import com.javuar.shop.product.product_variant_property_value_link.ProductVariantPropertyValueLink;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class ProductVariant {
    @Id
    @GeneratedValue
    private Integer id;

    @Column(nullable = false)
    private Long quantity;

    @Column(nullable = false)
    private BigDecimal price;

    private String imageUrl;

    // Single-valued association with (N:1) multiplicity
    // Owning side of the bidirectional relationship
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @OneToMany(mappedBy = "productVariant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariantPropertyValueLink> productVariantPropertyLinks;

    // Many-valued association with (1:N) multiplicity
    // Non-owning side of bidirectional relationship
    // The mappedBy specifies field on the owning side of the relationship
    @OneToMany(mappedBy = "productVariant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Feedback> feedbacks;
}