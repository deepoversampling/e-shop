package com.javuar.shop.property;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface PropertyRepository extends JpaRepository<Property, Integer> {
    @Transactional(readOnly = true)
    Optional<Property> findByName(String name);
}