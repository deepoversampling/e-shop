package com.javuar.shop.common.sort;

import lombok.experimental.UtilityClass;

@UtilityClass
public class SortBy {

    private enum SortByProduct implements SortableProperty {
        CREATED_DATE("createdDate"),
        NAME("name"),
        RATE("rate"),
        POPULARITY("popularity"),
        AVAILABILITY_ASC("availabilityAsc"),
        AVAILABILITY_DESC("availabilityDesc"),
        PRICE_ASC("priceAsc"),
        PRICE_DESC("priceDesc");

        private final String property;

        SortByProduct(String property) {
            this.property = property;
        }

        @Override
        public String getProperty() {
            return this.property;
        }
    }

    private enum SortByFeedback implements SortableProperty {
        NOTE("note");

        private final String property;

        SortByFeedback(String property) {
            this.property = property;
        }

        @Override
        public String getProperty() {
            return this.property;
        }
    }

    // Returns full enum class based on domain name
    public Class<? extends Enum<?>> getForDomain(String domain) {
        return switch (domain) {
            case "product" -> SortByProduct.class;
            case "feedback" -> SortByFeedback.class;
            default -> null;
        };
    }
}