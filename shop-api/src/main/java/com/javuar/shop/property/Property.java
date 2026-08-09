package com.javuar.shop.property;

import com.javuar.shop.category_template.CategoryTemplate;
import com.javuar.shop.property.property_preset.PropertyPreset;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Property {
    @Id
    @GeneratedValue
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    private String unit;

    // Many-valued association with (N:M) multiplicity (always has two sides)
    // The mappedBy specifies field on the owning side of the relationship
    @ManyToMany(mappedBy = "properties")
    private List<CategoryTemplate> categoryTemplates;


    // Many-valued association with (1:N) multiplicity
    // Non-owning side of bidirectional relationship
    // The mappedBy specifies field on the owning side of the relationship
    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC") // Presets have to be retrieved preserving their original ordering
    private List<PropertyPreset> propertyPresets;
}