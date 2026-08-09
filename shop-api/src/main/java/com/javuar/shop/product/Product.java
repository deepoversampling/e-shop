package com.javuar.shop.product;

import com.javuar.shop.category.Category;
import com.javuar.shop.common.auditing.BaseEntity;
import com.javuar.shop.feedback.Feedback;
import com.javuar.shop.product.product_variant.ProductVariant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Formula;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(indexes = {
        @Index(name = "idx_product_category_id", columnList = "category_id"),
        @Index(name = "idx_product_created_by", columnList = "created_by")
})
public class Product extends BaseEntity {
    @Id
    @GeneratedValue
    private Integer id;

    // Single-valued association with (N:1) multiplicity
    // Owning side of the unidirectional relationship
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Many-valued association with (1:N) multiplicity
    // Non-owning side of bidirectional relationship
    // The mappedBy specifies field on the owning side of the relationship
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @OrderBy("id ASC")
    private List<ProductVariant> productVariants = new ArrayList<>();

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    // Many-valued association with (1:N) multiplicity
    // Non-owning side of bidirectional relationship
    // The mappedBy specifies field on the owning side of the relationship
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Feedback> feedbacks;

    @Formula("""
            (SELECT COALESCE(AVG(f.note), 0)
             FROM feedback f
             WHERE f.product_id = id)
            """)
    private Double rate;

    // Sum of item quantities
    // which their carts are paid
    // and their variant exists in variants from this product
    @Formula("""
            (SELECT COALESCE(SUM(i.quantity), 0)
             FROM item i
                 INNER JOIN cart c
                     ON c.id = i.cart_id
             WHERE c.is_paid = true
                   AND i.product_variant_id IN (
                                                   SELECT pv.id FROM product_variant pv WHERE pv.product_id = id
                                               ))
            """)
    private Long popularity;

    // Variant with the lowest quantity
    @Formula("""
            (SELECT MIN(pv.quantity)
             FROM product_variant pv
             WHERE pv.product_id = id)
            """)
    private Long availabilityAsc;

    // Variant with the highest quantity
    @Formula("""
            (SELECT MAX(pv.quantity)
             FROM product_variant pv
             WHERE pv.product_id = id)
            """)
    private Long availabilityDesc;

    // Variant with the lowest price
    @Formula("""
            (SELECT MIN(pv.price)
            FROM product_variant pv
            WHERE pv.product_id = id)
            """)
    private BigDecimal priceAsc;

    // Variant with the highest price
    @Formula("""
            (SELECT MAX(pv.price)
            FROM product_variant pv
            WHERE pv.product_id = id)
            """)
    private BigDecimal priceDesc;
}