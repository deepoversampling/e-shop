package com.javuar.shop.category_template;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface CategoryTemplateRepository extends JpaRepository<CategoryTemplate, Integer> {
    @Transactional(readOnly = true)
    Optional<CategoryTemplate> findByCategory_Id(Integer id);
}