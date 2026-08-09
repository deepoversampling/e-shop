package com.javuar.shop.category_template;

import com.javuar.shop.category.Category;
import com.javuar.shop.property.Property;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(indexes = {
        @Index(name = "idx_category_template_category_id", columnList = "category_id")
})
// Bridge table between category templates and properties
public class CategoryTemplate {
    @Id
    @GeneratedValue
    private Integer id;

    // Single-valued association with (N:1) multiplicity
    // Owning side of the unidirectional relationship
    @OneToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Many-valued association with (N:M) multiplicity (always has two sides)
    // The join table is specified on the owning side (either side may be owning side if the association is bidirectional)
    @ManyToMany
    @JoinTable(
            name = "category_template_property_link",
            joinColumns = @JoinColumn(name = "category_template_id"),
            inverseJoinColumns = @JoinColumn(name = "property_id")
    )
    private List<Property> properties;
}