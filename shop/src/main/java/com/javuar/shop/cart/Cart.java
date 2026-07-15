package com.javuar.shop.cart;

import com.javuar.shop.cart.item.Item;
import com.javuar.shop.common.auditing.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(indexes = {
        @Index(name = "idx_cart_created_by", columnList = "created_by")
})
public class Cart extends BaseEntity {
    @Id
    @GeneratedValue
    private Integer id;

    @Column(nullable = false)
    private boolean isPaid;

    // Many-valued association with (1:N) multiplicity
    // Non-owning side of bidirectional relationship
    // The mappedBy specifies field on the owning side of the relationship
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @OrderBy("id ASC") // Items will be ordered by ID (from the oldest to the newest)
    private List<Item> items = new ArrayList<>();
}