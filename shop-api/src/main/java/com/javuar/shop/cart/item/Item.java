package com.javuar.shop.cart.item;

import com.javuar.shop.cart.Cart;
import com.javuar.shop.product.product_variant.ProductVariant;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(indexes = {
        @Index(name = "idx_item_product_variant_id", columnList = "product_variant_id")
})
public class Item {
    @Id
    @GeneratedValue
    private Integer id;

    // Single-valued association with (N:1) multiplicity
    // Owning side of the bidirectional relationship
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    // Single-valued association with (N:1) multiplicity
    // Owning side of the unidirectional relationship
    @ManyToOne
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    // Stores copy of the information from the product variant
    @Column(columnDefinition = "jsonb")
    @Type(JsonBinaryType.class)
    @JdbcTypeCode(SqlTypes.JSON)
    private ProductVariantSnapshot productVariantSnapshot;

    private Long quantity;

    @Transient
    public boolean isPresent() {
        return this.productVariant != null;
    }

    @Transient
    public boolean isAvailable() {
        if (isPresent()) {
            return productVariant.getQuantity() >= quantity;
        }
        return false;
    }
}