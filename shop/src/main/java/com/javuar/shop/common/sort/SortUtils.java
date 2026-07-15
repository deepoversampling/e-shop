package com.javuar.shop.common.sort;

import lombok.experimental.UtilityClass;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.stream.Stream;

@UtilityClass
public class SortUtils {
    private final int DEFAULT_PAGE_NUMBER = 0;
    private final int DEFAULT_PAGE_SIZE = 100;

    public Pageable createPageable(String domain, int pageNumber, int pageSize, String sortBy, String direction) {
        if (sortBy.equals("price") || sortBy.equals("availability")) {
            sortBy += direction;
        }

        if (isValidPageableArgs(domain, pageNumber, pageSize, sortBy, direction)) {
            Sort sort = Sort.by(
                    getSortDirection(direction),
                    getSortByProperty(domain, sortBy)
            );
            return PageRequest.of(pageNumber, pageSize, sort);
        } else {
            return PageRequest.of(DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE);
        }
    }

    private String getSortByProperty(String domain, String sortBy) {
        Class<? extends Enum<?>> sortByClass = SortBy.getForDomain(domain);
        Enum<?>[] properties = (sortByClass != null) ? sortByClass.getEnumConstants() : null;

        String sortByProperty = null;
        if (properties != null) {
            sortByProperty = Stream.of(properties)
                    .map(e -> ((SortableProperty) e).getProperty())
                    .filter(property -> property.equalsIgnoreCase(sortBy))
                    .findFirst()
                    .orElse(null);
        }

        return sortByProperty;
    }

    private Sort.Direction getSortDirection(String direction) {
        Sort.Direction sortDirection;
        try {
            sortDirection = Sort.Direction.fromString(direction);
        } catch (IllegalArgumentException e) {
            sortDirection = null;
        }

        return sortDirection;
    }


    private boolean isValidPageableArgs(String domain, int pageNumber, int pageSize, String sortBy, String direction) {
        return pageNumber >= 0 &&
                pageSize > 0 &&
                getSortByProperty(domain, sortBy) != null &&
                getSortDirection(direction) != null;
    }
}