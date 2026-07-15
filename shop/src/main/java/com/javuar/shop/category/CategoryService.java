package com.javuar.shop.category;

import com.javuar.shop.exception.exceptions.category.CategoryNotFoundException;
import com.javuar.shop.exception.exceptions.category.DuplicateCategoryNameException;
import com.javuar.shop.exception.exceptions.category.DuplicateRootCategoryException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.stereotype.Service;

import static com.javuar.shop.exception.BusinessErrorCodes.*;

@Service
@RequiredArgsConstructor
@EnableMethodSecurity
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @CacheEvict(cacheNames = "rootCategory", key = "''")
    public CategoryResponseDTO saveCategory(CategoryRequestDTO categoryRequestDTO) {
        if (categoryRepository.findByName(categoryRequestDTO.name()).isPresent()) {
            throw new DuplicateCategoryNameException(
                    DUPLICATE_CATEGORY_NAME.name(),
                    DUPLICATE_CATEGORY_NAME.getHttpStatus(),
                    String.format("Category with the name: %s already exists", categoryRequestDTO.name())
            );
        }

        Category newCategory = Category.builder()
                .name(categoryRequestDTO.name())
                .build();
        if (categoryRequestDTO.icon() == null || !categoryRequestDTO.icon().isEmpty()) {
            newCategory.setIcon(categoryRequestDTO.icon());
        } else {
            newCategory.setIcon(null);
        }

        if (categoryRequestDTO.parentId() != null) {
            Category parentCategory = categoryRepository.findById(categoryRequestDTO.parentId())
                    .orElseThrow(() -> new CategoryNotFoundException(
                            CATEGORY_NOT_FOUND.name(),
                            CATEGORY_NOT_FOUND.getHttpStatus(),
                            String.format("Parent category with the ID: %d was not found", categoryRequestDTO.parentId())
                    ));
            newCategory.setParentCategory(parentCategory);
        } else {
            if (categoryRepository.findRootCategory().isPresent()) {
                throw new DuplicateRootCategoryException(
                        DUPLICATE_ROOT_CATEGORY.name(),
                        DUPLICATE_ROOT_CATEGORY.getHttpStatus(),
                        "Root category already exists, ID of the parent category must not be missing"
                );
            }
        }

        return new CategoryResponseDTO(categoryRepository.save(newCategory));
    }

    @Cacheable(cacheNames = "rootCategory", key = "''")
    public CategoryResponseDTO fetchRootCategory() {
        Category rootCategory = categoryRepository.findRootCategory()
                .orElseThrow(() -> new CategoryNotFoundException(
                        ROOT_CATEGORY_NOT_FOUND.name(),
                        ROOT_CATEGORY_NOT_FOUND.getHttpStatus(),
                        "Root category was not found"
                ));
        return new CategoryResponseDTO(rootCategory);
    }

    public CategoryResponseDTO fetchCategoryById(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException(
                        CATEGORY_NOT_FOUND.name(),
                        CATEGORY_NOT_FOUND.getHttpStatus(),
                        String.format("Category with the ID: %d was not found", categoryId)
                ));

        return new CategoryResponseDTO(category);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @CacheEvict(cacheNames = "rootCategory", key = "''")
    public void removeCategoryById(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException(
                        CATEGORY_NOT_FOUND.name(),
                        CATEGORY_NOT_FOUND.getHttpStatus(),
                        String.format("Category with the ID: %d was not found", categoryId)
                ));

        categoryRepository.delete(category);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @CacheEvict(cacheNames = "rootCategory", key = "''")
    public void updateCategoryIcon(Integer categoryId, UpdateIconRequestDTO icon) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException(
                        CATEGORY_NOT_FOUND.name(),
                        CATEGORY_NOT_FOUND.getHttpStatus(),
                        String.format("Category with the ID: %d was not found", categoryId)
                ));

        if (!icon.icon().isEmpty()) {
            category.setIcon(icon.icon());
        } else {
            category.setIcon(null);
        }

        categoryRepository.save(category);
    }
}