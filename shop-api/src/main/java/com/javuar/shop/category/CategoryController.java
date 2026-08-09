package com.javuar.shop.category;

import com.javuar.shop.common.utils.UriProperties;
import com.javuar.shop.common.utils.UriUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    private final UriProperties uriProperties;

    @PostMapping
    public ResponseEntity<CategoryResponseDTO> createCategory(
            @Valid @RequestBody CategoryRequestDTO categoryRequestDTO
    ) {
        CategoryResponseDTO categoryResponseDTO = categoryService.saveCategory(categoryRequestDTO);
        URI location = UriUtils.createUri(
                uriProperties,
                "categories", categoryResponseDTO.id()
        );

        return ResponseEntity.created(location).body(categoryResponseDTO);
    }

    @GetMapping
    public ResponseEntity<CategoryResponseDTO> getRootCategory() {
        return ResponseEntity.ok(categoryService.fetchRootCategory());
    }

    @GetMapping("/{category-id}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(
            @PathVariable("category-id") Integer categoryId
    ) {
        return ResponseEntity.ok(categoryService.fetchCategoryById(categoryId));
    }

    @DeleteMapping("/{category-id}")
    public ResponseEntity<Void> deleteCategoryById(
            @PathVariable("category-id") Integer categoryId
    ) {
        categoryService.removeCategoryById(categoryId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{category-id}")
    public ResponseEntity<Void> patchCategoryIconById(
            @PathVariable("category-id") Integer categoryId,
            @Valid @RequestBody UpdateIconRequestDTO icon
    ) {
        categoryService.updateCategoryIcon(categoryId, icon);
        return ResponseEntity.ok().build();
    }
}