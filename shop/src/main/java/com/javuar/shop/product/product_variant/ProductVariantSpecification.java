package com.javuar.shop.product.product_variant;

import com.javuar.shop.product.Product;
import com.javuar.shop.product.product_variant_property_value_link.ProductVariantPropertyValueLink;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ProductVariantSpecification {

    public static Specification<ProductVariant> getFilteredProducts(
            String name, Long quantity, BigDecimal price,
            List<Integer> categoryIds,
            Map<String, String> filters) {
        return (Root<ProductVariant> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            Join<ProductVariant, Product> productJoin = root.join("product");

            if (name != null) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(productJoin.get("name")),
                        "%" + name.toLowerCase() + "%")
                );
            }

            if (quantity != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("quantity"), quantity));
            }

            if (price != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), price));
            }

            if (categoryIds != null && !categoryIds.isEmpty()) {
                predicates.add(productJoin.get("category").get("id").in(categoryIds));
            }

            // Predicate where property ID equals the passed propertyId and property value equals the passed value
            filters.forEach((propertyId, value) -> {
                Join<ProductVariant, ProductVariantPropertyValueLink> productVariantPropertyLinksJoin = root.join("productVariantPropertyLinks");

                Predicate idMatch = criteriaBuilder.equal(
                        productVariantPropertyLinksJoin.get("property").get("id"),
                        propertyId
                );

                Predicate valueMatch = criteriaBuilder.equal(
                        productVariantPropertyLinksJoin.get("propertyValue").get("value"),
                        value
                );

                Predicate propertyMatch = criteriaBuilder.and(idMatch, valueMatch);
                predicates.add(propertyMatch);
            });

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}