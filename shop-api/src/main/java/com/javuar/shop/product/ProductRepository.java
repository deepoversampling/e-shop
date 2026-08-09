package com.javuar.shop.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Transactional(readOnly = true)
public interface ProductRepository extends JpaRepository<Product, Integer> {
    Page<Product> findByCategory_IdIn(List<Integer> ids, Pageable pageable);
    List<Product> findByCategory_IdIn(List<Integer> ids);
    Page<Product> findByIdIn(Set<Integer> ids, Pageable pageable);
    Optional<Product> findProductById(Integer id);
    List<Product> findByCreatedBy(String createdBy);
    List<Product> findByIdIn(Set<Integer> ids);
}