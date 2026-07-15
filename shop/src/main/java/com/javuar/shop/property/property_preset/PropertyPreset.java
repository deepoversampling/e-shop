package com.javuar.shop.property.property_preset;

import com.javuar.shop.property.Property;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class PropertyPreset {
    @Id
    @GeneratedValue
    private Integer id;

    // Single-valued association with (N:1) multiplicity
    // Owning side of the bidirectional relationship
    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;

    @Column(nullable = false)
    private String value;
}