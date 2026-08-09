package com.javuar.shop.feedback;

import com.javuar.shop.cart.Cart;
import com.javuar.shop.product.Product;
import com.javuar.shop.product.product_variant.ProductVariant;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(indexes = {
        @Index(name = "idx_feedback_product_id", columnList = "product_id"),
        @Index(name = "idx_feedback_cart_id", columnList = "cart_id")
})
public class Feedback {
    @Id
    @GeneratedValue
    private Integer id;

    @Column(nullable = false)
    private Double note;

    @Column(nullable = false)
    private String comment;

    // Single-valued association with (N:1) multiplicity
    // Owning side of the bidirectional relationship
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // Single-valued association with (N:1) multiplicity
    // Owning side of the bidirectional relationship
    @ManyToOne
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    // Single-valued association with (N:1) multiplicity
    // Owning side of the unidirectional relationship
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;
}