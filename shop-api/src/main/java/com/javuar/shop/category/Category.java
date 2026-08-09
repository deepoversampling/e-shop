package com.javuar.shop.category;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
// Self-referencing table (the foreign key constraint references column within the same table)
public class Category {
    @Id
    @GeneratedValue
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column()
    private String icon;

    // Single-valued association with (N:1) multiplicity
    // Owning side of the bidirectional relationship
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parentCategory;

    // Many-valued association with (1:N) multiplicity
    // Non-owning side of bidirectional relationship
    // The mappedBy specifies field on the owning side of the relationship
    @OneToMany(mappedBy = "parentCategory")
    @Builder.Default
    @OrderBy("id ASC")
    private List<Category> subcategories = new ArrayList<>();

    public List<Integer> getLeafCategories() {
        if (subcategories.isEmpty()) {
            return List.of(id);
        }

        return subcategories.stream()
                .flatMap(subcategory -> subcategory.getLeafCategories().stream())
                .collect(Collectors.toList());
    }
}