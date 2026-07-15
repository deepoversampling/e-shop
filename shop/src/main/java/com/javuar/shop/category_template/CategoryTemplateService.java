package com.javuar.shop.category_template;

import com.javuar.shop.category.Category;
import com.javuar.shop.category.CategoryRepository;
import com.javuar.shop.exception.exceptions.category.CategoryNotFoundException;
import com.javuar.shop.exception.exceptions.category_template.CategoryTemplateNotFoundException;
import com.javuar.shop.exception.exceptions.category_template.CategoryTemplateReferencedException;
import com.javuar.shop.exception.exceptions.category_template.DuplicateCategoryTemplateException;
import com.javuar.shop.exception.exceptions.category_template.NonLeafCategoryException;
import com.javuar.shop.exception.exceptions.property.PropertyNotFoundException;
import com.javuar.shop.product.ProductRepository;
import com.javuar.shop.property.Property;
import com.javuar.shop.property.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.javuar.shop.exception.BusinessErrorCodes.*;

@Service
@RequiredArgsConstructor
@EnableMethodSecurity
public class CategoryTemplateService {
    private final CategoryTemplateRepository categoryTemplateRepository;
    private final CategoryRepository categoryRepository;
    private final PropertyRepository propertyRepository;
    private final ProductRepository productRepository;
    private final CategoryTemplateMapper categoryTemplateMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public CategoryTemplateResponseDTO saveCategoryTemplate(CategoryTemplateRequestDTO categoryTemplateRequestDTO) {

        Category category = categoryRepository.findById(categoryTemplateRequestDTO.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(
                        CATEGORY_NOT_FOUND.name(),
                        CATEGORY_NOT_FOUND.getHttpStatus(),
                        String.format("Category with the ID: %d was not found", categoryTemplateRequestDTO.categoryId())
                ));

        boolean templateExists = categoryTemplateRepository.findByCategory_Id(categoryTemplateRequestDTO.categoryId()).isPresent();
        if (templateExists) {
            throw new DuplicateCategoryTemplateException(
                    DUPLICATE_CATEGORY_TEMPLATE.name(),
                    DUPLICATE_CATEGORY_TEMPLATE.getHttpStatus(),
                    String.format("Category template for the category with the ID: %d already exists", categoryTemplateRequestDTO.categoryId())
            );
        }

        if (!category.getSubcategories().isEmpty()) {
            throw new NonLeafCategoryException(
                    NON_LEAF_CATEGORY.name(),
                    NON_LEAF_CATEGORY.getHttpStatus(),
                    String.format("Cannot perform operation because category with the ID: %d is not a leaf node", category.getId())
            );
        }

        CategoryTemplate newCategoryTemplate = CategoryTemplate.builder()
                .category(category)
                .build();

        List<Property> properties = new ArrayList<>();
        categoryTemplateRequestDTO.propertyIds().forEach(propertyId -> {
            Property property = propertyRepository.findById(propertyId)
                    .orElseThrow(() -> new PropertyNotFoundException(
                            PROPERTY_NOT_FOUND.name(),
                            PROPERTY_NOT_FOUND.getHttpStatus(),
                            String.format("Property with the ID: %d was not found", propertyId)
                    ));
            properties.add(property);
        });
        newCategoryTemplate.setProperties(properties);

        return categoryTemplateMapper.toCategoryTemplateResponseDTO(
                categoryTemplateRepository.save(newCategoryTemplate)
        );
    }

    public CategoryTemplateResponseDTO fetchCategoryTemplateById(Integer categoryTemplateId) {
        CategoryTemplate categoryTemplate = categoryTemplateRepository.findById(categoryTemplateId)
                .orElseThrow(() -> new CategoryTemplateNotFoundException(
                        CATEGORY_TEMPLATE_NOT_FOUND.name(),
                        CATEGORY_TEMPLATE_NOT_FOUND.getHttpStatus(),
                        String.format("Category template with the ID: %d was not found", categoryTemplateId)
                ));

        return categoryTemplateMapper.toCategoryTemplateResponseDTO(categoryTemplate);
    }

    @Cacheable(cacheNames = "categoryTemplate", key = "#categoryId")
    public CategoryTemplateResponseDTO fetchCategoryTemplateByCategoryId(Integer categoryId) {
        CategoryTemplate categoryTemplate = categoryTemplateRepository.findByCategory_Id(categoryId)
                .orElseThrow(() -> new CategoryTemplateNotFoundException(
                        CATEGORY_TEMPLATE_NOT_FOUND.name(),
                        CATEGORY_TEMPLATE_NOT_FOUND.getHttpStatus(),
                        String.format("Category template belonging to the category with the ID: %d was not found", categoryId)
                ));

        return categoryTemplateMapper.toCategoryTemplateResponseDTO(categoryTemplate);
    }

    public List<CategoryTemplateResponseDTO> fetchCategoryTemplates() {
        return categoryTemplateRepository.findAll().stream()
                .map(categoryTemplateMapper::toCategoryTemplateResponseDTO)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @CacheEvict(cacheNames = "categoryTemplate", key = "#categoryId")
    public void removeCategoryTemplateByCategoryId(Integer categoryId) {
        CategoryTemplate categoryTemplate = categoryTemplateRepository.findByCategory_Id(categoryId)
                .orElseThrow(() -> new CategoryTemplateNotFoundException(
                        CATEGORY_TEMPLATE_NOT_FOUND.name(),
                        CATEGORY_TEMPLATE_NOT_FOUND.getHttpStatus(),
                        String.format("Category template with the ID: %d was not found", categoryId)
                ));

        boolean isTemplateReferenced = !productRepository.findByCategory_IdIn(List.of(categoryId)).isEmpty();

        if (isTemplateReferenced) {
            throw new CategoryTemplateReferencedException(
                    DATA_INTEGRITY_VIOLATION.name(),
                    DATA_INTEGRITY_VIOLATION.getHttpStatus(),
                    "Cannot delete category template, it is still referenced"
            );
        } else {
            categoryTemplateRepository.delete(categoryTemplate);
        }
    }
}