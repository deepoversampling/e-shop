package com.javuar.shop.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Transactional(readOnly = true)
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    @Query("""
            SELECT c
            FROM Category c
            WHERE c.parentCategory IS NULL
            """)
    Optional<Category> findRootCategory();

    Optional<Category> findByName(String name);
}