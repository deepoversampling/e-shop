package com.javuar.shop.cart.item;

import com.javuar.shop.product.product_variant.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
public interface ItemRepository extends JpaRepository<Item, Integer> {
    List<Item> findAllByProductVariant_Id(Integer productVariantId);

    @Query("""
            SELECT SUM(i.quantity)
            FROM Item i
            WHERE i.productVariant = :variant
            """)
    Long sumQuantityByProductVariant(ProductVariant variant);
}