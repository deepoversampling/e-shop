package com.javuar.shop.category_template;

import com.javuar.shop.common.utils.UriProperties;
import com.javuar.shop.common.utils.UriUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("category-templates")
@RequiredArgsConstructor
public class CategoryTemplateController {
    private final CategoryTemplateService categoryTemplateService;
    private final UriProperties uriProperties;

    @PostMapping
    public ResponseEntity<CategoryTemplateResponseDTO> createCategoryTemplate(
            @Valid @RequestBody CategoryTemplateRequestDTO categoryTemplateRequestDTO
    ) {
        CategoryTemplateResponseDTO categoryTemplateResponseDTO = categoryTemplateService.saveCategoryTemplate(categoryTemplateRequestDTO);
        URI location = UriUtils.createUri(
                uriProperties,
                "category-templates", categoryTemplateResponseDTO.id()
        );

        return ResponseEntity.created(location).body(categoryTemplateResponseDTO);
    }

    @GetMapping("/{category-template-id}")
    public ResponseEntity<CategoryTemplateResponseDTO> getCategoryTemplateById(
            @PathVariable("category-template-id") Integer categoryTemplateId
    ) {
        return ResponseEntity.ok(this.categoryTemplateService.fetchCategoryTemplateById(categoryTemplateId));
    }

    @GetMapping("/category/{category-id}")
    public ResponseEntity<CategoryTemplateResponseDTO> getCategoryTemplateByCategoryId(
            @PathVariable("category-id") Integer categoryId
    ) {
        return ResponseEntity.ok(categoryTemplateService.fetchCategoryTemplateByCategoryId(categoryId));
    }

    @GetMapping
    public ResponseEntity<List<CategoryTemplateResponseDTO>> getCategoryTemplates() {
        return ResponseEntity.ok(categoryTemplateService.fetchCategoryTemplates());
    }

    @DeleteMapping("/{category-id}")
    public ResponseEntity<Void> deleteCategoryTemplateByCategoryId(
            @PathVariable("category-id") Integer categoryId
    ) {
        categoryTemplateService.removeCategoryTemplateByCategoryId(categoryId);
        return ResponseEntity.noContent().build();
    }
}