package com.javuar.shop.product.product_variant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductVariantRepository extends JpaSpecificationExecutor<ProductVariant>, JpaRepository<ProductVariant, Integer> {
}
