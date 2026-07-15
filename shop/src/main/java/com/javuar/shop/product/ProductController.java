package com.javuar.shop.product;

import com.javuar.shop.common.pagination.PageResponse;
import com.javuar.shop.product.product_variant.ProductVariantRequestDTO;
import com.javuar.shop.product.product_variant.ProductVariantResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(
            @Valid @RequestBody ProductRequestDTO productRequestDTO,
            Authentication authentication
    ) {
        return ResponseEntity.ok(productService.saveProduct(productRequestDTO, authentication));
    }

    @GetMapping("/{product-id}")
    public ResponseEntity<ProductResponseDTO> getProductById(
            @PathVariable("product-id") Integer productId
    ) {
        return ResponseEntity.ok(productService.fetchProductById(productId));
    }

    @GetMapping("/owner")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByOwner(
            Authentication authentication
    ) {
        return ResponseEntity.ok(productService.fetchProductsByOwner(authentication));
    }

    @GetMapping
    public ResponseEntity<PageResponse<ProductResponseDTO>> getProductsByCategoryId(
            @RequestParam(name = "page-number", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(name = "page-size", defaultValue = "8", required = false) int pageSize,
            @RequestParam(name = "sort", defaultValue = "name", required = false) String sort,
            @RequestParam(name = "direction", defaultValue = "asc", required = false) String direction,
            @RequestParam(name = "category-id") Integer categoryId
    ) {
        return ResponseEntity.ok(productService.fetchProductsByCategoryId(
                pageNumber, pageSize, sort, direction, categoryId
        ));
    }

    @PostMapping("/search")
    public ResponseEntity<PageResponse<ProductResponseDTO>> getFilteredProducts(
            @RequestParam(name = "page-number", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(name = "page-size", defaultValue = "8", required = false) int pageSize,
            @RequestParam(name = "sort", defaultValue = "name", required = false) String sort,
            @RequestParam(name = "direction", defaultValue = "asc", required = false) String direction,
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "quantity", required = false) Long quantity,
            @RequestParam(name = "price", required = false) BigDecimal price,
            @RequestParam(name = "category-id") Integer categoryId,
            @RequestBody Map<String, String> filters // No validation needed, filters are optional
    ) {
        return ResponseEntity.ok(productService.fetchFilteredProducts(
                pageNumber, pageSize, sort, direction, name, quantity, price, categoryId, filters
        ));
    }

    @DeleteMapping(value = "/{product-id}")
    public ResponseEntity<Void> deleteProductById(
            @PathVariable("product-id") Integer productId,
            Authentication authentication
    ) {
        productService.removeProductById(productId, authentication);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{product-id}/product-variants")
    public ResponseEntity<ProductVariantResponseDTO> createProductVariant(
            @PathVariable("product-id") Integer productId,
            @Valid @RequestBody ProductVariantRequestDTO productRequestDTO,
            Authentication authentication
    ) {
        return ResponseEntity.ok(productService.saveProductVariant(productId, productRequestDTO, authentication));
    }

    @GetMapping("/{product-id}/product-variants/{product-variant-id}")
    public ResponseEntity<ProductVariantResponseDTO> getProductVariantById(
            @PathVariable("product-id") Integer productId,
            @PathVariable("product-variant-id") Integer productVariantId
    ) {
        return ResponseEntity.ok(productService.fetchProductVariantById(productId, productVariantId));
    }

    @DeleteMapping("/{product-id}/product-variants/{product-variant-id}")
    public ResponseEntity<Void> deleteProductVariantById(
            @PathVariable("product-id") Integer productId,
            @PathVariable("product-variant-id") Integer productVariantId,
            Authentication authentication
    ) {
        productService.removeProductVariantById(productId, productVariantId, authentication);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{product-id}/product-variants/{product-variant-id}/image", consumes = "multipart/form-data")
    public ResponseEntity<ProductVariantResponseDTO> uploadProductVariantImage(
            @PathVariable("product-id") Integer productId,
            @PathVariable("product-variant-id") Integer productVariantId,
            @RequestPart(name = "file") MultipartFile file,
            Authentication authentication
    ) {
        return ResponseEntity.ok(productService.setProductVariantImage(productId, productVariantId, file, authentication));
    }

    @DeleteMapping(value = "/{product-id}/product-variants/{product-variant-id}/image")
    public ResponseEntity<Void> deleteProductVariantImageById(
            @PathVariable("product-id") Integer productId,
            @PathVariable("product-variant-id") Integer productVariantId,
            Authentication authentication
    ) {
        productService.removeProductVariantImageById(productId, productVariantId, authentication);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{product-id}/product-variants/{product-variant-id}/quantity")
    public ResponseEntity<Void> patchProductVariantQuantityById(
            @PathVariable("product-id") Integer productId,
            @PathVariable("product-variant-id") Integer productVariantId,
            @Valid @RequestBody UpdateQuantityRequestDTO quantity,
            Authentication authentication
    ) {
        productService.updateProductVariantQuantity(productId, productVariantId, quantity, authentication);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{product-id}/product-variants/{product-variant-id}/price")
    public ResponseEntity<Void> patchProductVariantPriceById(
            @PathVariable("product-id") Integer productId,
            @PathVariable("product-variant-id") Integer productVariantId,
            @Valid @RequestBody UpdatePriceRequestDTO quantity,
            Authentication authentication
    ) {
        productService.updateProductVariantPrice(productId, productVariantId, quantity, authentication);
        return ResponseEntity.ok().build();
    }
}