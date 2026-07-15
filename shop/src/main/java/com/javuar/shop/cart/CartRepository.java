package com.javuar.shop.cart;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    @Transactional(readOnly = true)
    List<Cart> findAllByCreatedBy(String createdBy);
}