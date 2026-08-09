package com.javuar.shop.product;

import com.amazonaws.SdkClientException;
import com.javuar.shop.aws.S3ImageService;
import com.javuar.shop.cart.CartResponseDTO;
import com.javuar.shop.cart.item.ItemRepository;
import com.javuar.shop.category.Category;
import com.javuar.shop.category.CategoryRepository;
import com.javuar.shop.category_template.CategoryTemplate;
import com.javuar.shop.category_template.CategoryTemplateRepository;
import com.javuar.shop.common.pagination.PageResponse;
import com.javuar.shop.common.sort.SortUtils;
import com.javuar.shop.exception.exceptions.cart.QuantityUnchangedException;
import com.javuar.shop.exception.exceptions.category.CategoryNotFoundException;
import com.javuar.shop.exception.exceptions.category_template.CategoryTemplateNotFoundException;
import com.javuar.shop.exception.exceptions.category_template.NonLeafCategoryException;
import com.javuar.shop.exception.exceptions.product.*;
import com.javuar.shop.exception.exceptions.property.PropertyNotFoundException;
import com.javuar.shop.feedback.FeedbackResponseDTO;
import com.javuar.shop.product.product_variant.*;
import com.javuar.shop.product.product_variant_property_value_link.ProductVariantPropertyValueLink;
import com.javuar.shop.product.product_variant_property_value_link.property_value.PropertyValue;
import com.javuar.shop.product.product_variant_property_value_link.property_value.PropertyValueRepository;
import com.javuar.shop.property.Property;
import com.javuar.shop.property.PropertyRepository;
import com.javuar.shop.property.property_preset.PropertyPreset;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import static com.javuar.shop.common.cache.ClearOwnerCartsCache.*;
import static com.javuar.shop.common.cache.ClearOwnerProductsCache.*;
import static com.javuar.shop.common.cache.ClearProductFeedbacksCache.*;
import static com.javuar.shop.common.constants.RegexConstants.CONTINUOUS_PATTERN;
import static com.javuar.shop.exception.BusinessErrorCodes.*;

@Service
@RequiredArgsConstructor
@EnableMethodSecurity
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductVariantRepository productVariantRepository;
    private final ProductVariantMapper productVariantMapper;
    private final CategoryRepository categoryRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyValueRepository propertyValueRepository;
    private final CategoryTemplateRepository categoryTemplateRepository;
    private final ItemRepository itemRepository;
    private final RedisTemplate<String, List<CartResponseDTO>> cartRedisTemplate;
    private final RedisTemplate<String, List<ProductResponseDTO>> productRedisTemplate;
    private final RedisTemplate<String, PageResponse<FeedbackResponseDTO>> feedbackRedisTemplate;
    private final S3ImageService s3ImageService;

    @PreAuthorize("hasRole('USER') && !hasRole('ADMIN')")
    public ProductResponseDTO saveProduct(ProductRequestDTO productRequestDTO, Authentication authentication) {
        Category category = categoryRepository.findById(productRequestDTO.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(
                        CATEGORY_NOT_FOUND.name(),
                        CATEGORY_NOT_FOUND.getHttpStatus(),
                        String.format("Category with the ID: %d was not found", productRequestDTO.categoryId())
                ));

        if (!category.getSubcategories().isEmpty()) {
            throw new NonLeafCategoryException(
                    NON_LEAF_CATEGORY.name(),
                    NON_LEAF_CATEGORY.getHttpStatus(),
                    String.format("Cannot perform operation because category with the ID: %d is not a leaf node", category.getId())
            );
        }

        Product newProduct = Product.builder()
                .category(category)
                .name(productRequestDTO.name())
                .description(productRequestDTO.description())
                .build();

        newProduct = productRepository.save(newProduct);
        clearOwnerProductsCache(authentication.getName(), productRedisTemplate);

        return productMapper.toProductResponseDTO(newProduct);
    }

    public ProductResponseDTO fetchProductById(Integer productId) {
        Product product = productRepository.findProductById(productId)
                .orElseThrow(() -> new ProductNotFoundException(
                        PRODUCT_NOT_FOUND.name(),
                        PRODUCT_NOT_FOUND.getHttpStatus(),
                        String.format("Product with the ID: %d was not found", productId)
                ));
        return productMapper.toProductResponseDTO(product);
    }

    @PreAuthorize("hasRole('USER') && !hasRole('ADMIN')")
    @Cacheable(cacheNames = "ownerProducts", key = "#authentication.name")
    public List<ProductResponseDTO> fetchProductsByOwner(Authentication authentication) {
        List<Product> products = productRepository.findByCreatedBy(authentication.getName());

        // k -> ProductVariant ID
        // v -> Sum
        Map<Integer, Long> sumsMap = products.stream()
                .flatMap(product -> product.getProductVariants().stream())
                .collect(Collectors.toMap(
                        ProductVariant::getId,
                        variant -> {
                            Long sum = itemRepository.sumQuantityByProductVariant(variant);
                            return sum == null ? 0L : sum;
                        }
                ));

        return products.stream()
                .map(product -> {
                    ProductResponseDTO productDto = productMapper.toProductResponseDTO(product);
                    productDto.variants()
                            .forEach(variantDto -> variantDto.setDemand(sumsMap.get(variantDto.getId())));
                    return productDto;
                })
                .toList();
    }

    public PageResponse<ProductResponseDTO> fetchProductsByCategoryId(
            int pageNumber, int pageSize,
            String sortBy, String direction, Integer categoryId
    ) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException(
                        CATEGORY_NOT_FOUND.name(),
                        CATEGORY_NOT_FOUND.getHttpStatus(),
                        String.format("Category with the ID: %d was not found", categoryId)
                ));

        Pageable pageable = SortUtils.createPageable("product", pageNumber, pageSize, sortBy, direction);

        // If the passed category is not a leaf node, fetch products from its leaves
        List<Integer> leafCategories = category.getLeafCategories();
        Page<Product> products = productRepository.findByCategory_IdIn(leafCategories, pageable);

        List<ProductResponseDTO> productResponseDTOs = products.stream()
                .map(productMapper::toProductResponseDTO)
                .toList();

        return new PageResponse<>(
                productResponseDTOs,
                products.getNumber(),
                products.getSize(),
                products.getTotalElements(),
                products.getTotalPages(),
                products.isFirst(),
                products.isLast()
        );
    }

    public PageResponse<ProductResponseDTO> fetchFilteredProducts(
            int pageNumber, int pageSize,
            String sortBy, String direction, String name,
            Long quantity, BigDecimal price, Integer categoryId,
            Map<String, String> filters
    ) {
        // k -> Property ID
        // v -> PropertyPreset
        Map<String, String> resolvedFilters = filters.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> {
                            Property property = propertyRepository.findById(Integer.valueOf(entry.getKey()))
                                    .orElseThrow(() -> new PropertyNotFoundException(
                                            PROPERTY_NOT_FOUND.name(),
                                            PROPERTY_NOT_FOUND.getHttpStatus(),
                                            String.format("Property with the ID: %s was not found", entry.getKey())
                                    ));

                            // Determines type of the property (continuous or discrete) by the first preset
                            if (property.getPropertyPresets().get(0).getValue().matches(CONTINUOUS_PATTERN.pattern())) {
                                List<PropertyPreset> propertyPresets = property.getPropertyPresets();
                                // If the property is continuous, matching preset is returned
                                for (PropertyPreset preset : propertyPresets) {
                                    try {
                                        String[] parts = preset.getValue().split("\\|");
                                        double min = Double.parseDouble(parts[0]);
                                        double max = Double.parseDouble(parts[1]);
                                        double value = Double.parseDouble(entry.getValue());

                                        if (value >= min && value <= max) {
                                            return preset.getValue();
                                        }
                                    } catch (NumberFormatException ignored) {
                                    }
                                }
                                // If the property is continuous but no matching preset was found then original value is returned
                                return entry.getValue();
                            }
                            // If the property is discrete, original value is returned
                            return entry.getValue();
                        }
                ));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException(
                        CATEGORY_NOT_FOUND.name(),
                        CATEGORY_NOT_FOUND.getHttpStatus(),
                        String.format("Category with the ID: %d was not found", categoryId)
                ));

        Pageable pageable = SortUtils.createPageable("product", pageNumber, pageSize, sortBy, direction);

        List<Integer> leafCategories = category.getLeafCategories();
        // Retrieves product variants that meet the specification
        Specification<ProductVariant> productVariantSpecification =
                ProductVariantSpecification.getFilteredProducts(name, quantity, price, leafCategories, resolvedFilters);
        List<ProductVariant> filteredProductVariants = productVariantRepository.findAll(Specification.where(productVariantSpecification));

        // Collects unique product IDs from the filtered product variants
        Set<Integer> filteredProductIds = filteredProductVariants.stream()
                .map(variant -> variant.getProduct().getId())
                .collect(Collectors.toSet());

        // Paginated products that match filtered productId IDs
        Page<Product> paginatedFilteredProducts = productRepository.findByIdIn(filteredProductIds, pageable);

        // Converts paginated, filtered products to list of ProductResponseDTOs
        List<ProductResponseDTO> productResponseDTOs = paginatedFilteredProducts.stream()
                .map(product -> {
                    // Each product contains only filtered variants
                    List<ProductVariantResponseDTO> productVariantResponseDTOs = filteredProductVariants.stream()
                            .filter(variant -> variant.getProduct().getId().equals(product.getId()))
                            .map(productVariantMapper::toProductVariantResponseDTO)
                            .collect(Collectors.toList());

                    // Sorting products by availability or price requires variants to be sorted as well
                    // Sorting with ascending direction takes the variant with the lowest value of the property (quantity or price) and
                    // This means the variants need to be sorted in natural order when the direction is ascending
                    Optional<Sort.Order> order = pageable.getSort().stream()
                            .findFirst();

                    if (order.isPresent()) {
                        if (order.get().getProperty().equals("availabilityAsc")) {
                            productVariantResponseDTOs
                                    .sort(Comparator.comparing(ProductVariantResponseDTO::getQuantity));
                        }

                        if (order.get().getProperty().equals("availabilityDesc")) {
                            productVariantResponseDTOs
                                    .sort(Comparator.comparing(ProductVariantResponseDTO::getQuantity).reversed());
                        }

                        if (order.get().getProperty().equals("priceAsc")) {
                            productVariantResponseDTOs
                                    .sort(Comparator.comparing(ProductVariantResponseDTO::getPrice));
                        }

                        if (order.get().getProperty().equals("priceDesc")) {
                            productVariantResponseDTOs
                                    .sort(Comparator.comparing(ProductVariantResponseDTO::getPrice).reversed());
                        }
                    }

                    return productMapper.toProductResponseDTO(product, productVariantResponseDTOs);
                })
                .toList();

        return new PageResponse<>(
                productResponseDTOs,
                paginatedFilteredProducts.getNumber(),
                paginatedFilteredProducts.getSize(),
                paginatedFilteredProducts.getTotalElements(),
                paginatedFilteredProducts.getTotalPages(),
                paginatedFilteredProducts.isFirst(),
                paginatedFilteredProducts.isLast()
        );
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Transactional
    public void removeProductById(Integer productId, Authentication authentication) {
        Product product = productRepository.findProductById(productId)
                .orElseThrow(() -> new ProductNotFoundException(
                        PRODUCT_NOT_FOUND.name(),
                        PRODUCT_NOT_FOUND.getHttpStatus(),
                        String.format("Product with the ID: %d was not found", productId)
                ));

        if (!authentication.getName().equals(product.getCreatedBy())
                && !authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            throw new UnauthorizedProductActionException(
                    UNAUTHORIZED_PRODUCT_ACTION.name(),
                    UNAUTHORIZED_PRODUCT_ACTION.getHttpStatus(),
                    String.format("Only the owner and admin can delete the product with the ID: %d", productId)
            );
        }

        // Unique users which carts contain removed product
        Set<String> cartOwners = new HashSet<>();
        List<String> imageUrls = new ArrayList<>();

        product.getProductVariants().forEach(variant -> {
            if (variant.getImageUrl() != null) {
                imageUrls.add(variant.getImageUrl());
            }

            // Removes reference to removed product variant in items
            itemRepository.findAllByProductVariant_Id(variant.getId())
                    .forEach(item -> {
                        item.setProductVariant(null);
                        cartOwners.add(item.getCart().getCreatedBy());
                    });
        });
        productRepository.delete(product);

        // After the product has been removed, images are removed from S3 bucket as well
        imageUrls.forEach(imageUrl -> {
            try {
                s3ImageService.removeImageFromS3(imageUrl);
            } catch (SdkClientException e) {
                throw new FailedToRemoveFileException(
                        FAILED_TO_REMOVE_FILE.name(),
                        FAILED_TO_REMOVE_FILE.getHttpStatus(),
                        "Could not remove image from the cloud storage",
                        e
                );
            }
        });

        clearOwnerProductsCache(authentication.getName(), productRedisTemplate);
        clearProductFeedbacksCache(productId, feedbackRedisTemplate);
        cartOwners.forEach(owner -> clearOwnerCartsCache(owner, cartRedisTemplate));
    }

    @PreAuthorize("hasRole('USER') && !hasRole('ADMIN')")
    @Transactional
    public ProductVariantResponseDTO saveProductVariant(Integer productId, ProductVariantRequestDTO
            productVariantRequestDTO, Authentication authentication) {
        Product product = productRepository.findProductById(productId)
                .orElseThrow(() -> new ProductNotFoundException(
                        PRODUCT_NOT_FOUND.name(),
                        PRODUCT_NOT_FOUND.getHttpStatus(),
                        String.format("Product with the ID: %d was not found", productId)
                ));

        if (!authentication.getName().equals(product.getCreatedBy())) {
            throw new UnauthorizedProductActionException(
                    UNAUTHORIZED_PRODUCT_ACTION.name(),
                    UNAUTHORIZED_PRODUCT_ACTION.getHttpStatus(),
                    String.format("Only the owner can create a product variant in the product with the ID: %d", productId)
            );
        }

        CategoryTemplate categoryTemplate = categoryTemplateRepository.findByCategory_Id(product.getCategory().getId())
                .orElseThrow(() -> new CategoryTemplateNotFoundException(
                        CATEGORY_TEMPLATE_NOT_FOUND.name(),
                        CATEGORY_TEMPLATE_NOT_FOUND.getHttpStatus(),
                        String.format("Category template with the ID: %d was not found", product.getCategory().getId())
                ));

        ProductVariant newProductVariant = ProductVariant.builder()
                .quantity(productVariantRequestDTO.quantity())
                .price(productVariantRequestDTO.price())
                .product(product)
                .build();

        List<ProductVariantPropertyValueLink> productVariantPropertyValueLinks = categoryTemplate.getProperties().stream()
                .map(property -> {
                    // Checks if the value exists in the passed properties
                    String value = productVariantRequestDTO.properties().get(property.getId());
                    if (value == null) {
                        throw new InvalidProductVariantFormatException(
                                INVALID_PRODUCT_VARIANT_FORMAT.name(),
                                INVALID_PRODUCT_VARIANT_FORMAT.getHttpStatus(),
                                String.format("Product variant should have property: %s with the ID: %d", property.getName(), property.getId())
                        );
                    }

                    // Checks if the passed value matches any preset
                    boolean isValueValid = property.getPropertyPresets().stream()
                            .map(PropertyPreset::getValue)
                            .anyMatch(preset -> preset.equals(value));

                    if (!isValueValid) {
                        throw new InvalidProductVariantFormatException(
                                INVALID_PRODUCT_VARIANT_FORMAT.name(),
                                INVALID_PRODUCT_VARIANT_FORMAT.getHttpStatus(),
                                String.format("Property %s does not have preset value: %s", property.getName(), value)
                        );
                    }

                    PropertyValue propertyValue = PropertyValue.builder()
                            .value(value)
                            .build();
                    propertyValueRepository.save(propertyValue);

                    return ProductVariantPropertyValueLink.builder()
                            .productVariant(newProductVariant)
                            .property(property)
                            .propertyValue(propertyValue)
                            .build();
                })
                .toList();

        newProductVariant.setProductVariantPropertyLinks(productVariantPropertyValueLinks);
        clearOwnerProductsCache(authentication.getName(), productRedisTemplate);

        return productVariantMapper.toProductVariantResponseDTO(productVariantRepository.save(newProductVariant));
    }

    public ProductVariantResponseDTO fetchProductVariantById(Integer productId, Integer productVariantId) {
        productRepository.findProductById(productId)
                .orElseThrow(() -> new ProductNotFoundException(
                        PRODUCT_NOT_FOUND.name(),
                        PRODUCT_NOT_FOUND.getHttpStatus(),
                        String.format("Product with the ID: %d was not found", productId)
                ));

        ProductVariant productVariant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new ProductVariantNotFoundException(
                        PRODUCT_VARIANT_NOT_FOUND.name(),
                        PRODUCT_VARIANT_NOT_FOUND.getHttpStatus(),
                        String.format("Product variant with the ID: %d was not found", productVariantId)
                ));

        return productVariantMapper.toProductVariantResponseDTO(productVariant);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Transactional
    public void removeProductVariantById(Integer productId, Integer productVariantId, Authentication authentication) {
        Product product = productRepository.findProductById(productId)
                .orElseThrow(() -> new ProductNotFoundException(
                        PRODUCT_NOT_FOUND.name(),
                        PRODUCT_NOT_FOUND.getHttpStatus(),
                        String.format("Product with the ID: %d was not found", productId)
                ));

        ProductVariant productVariant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new ProductVariantNotFoundException(
                        PRODUCT_VARIANT_NOT_FOUND.name(),
                        PRODUCT_VARIANT_NOT_FOUND.getHttpStatus(),
                        String.format("Product variant with the ID: %d was not found", productVariantId)
                ));

        if (!authentication.getName().equals(product.getCreatedBy())
                && !authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            throw new UnauthorizedProductActionException(
                    UNAUTHORIZED_PRODUCT_ACTION.name(),
                    UNAUTHORIZED_PRODUCT_ACTION.getHttpStatus(),
                    String.format("Only the owner can remove the product variant with the ID: %d", productVariantId)
            );
        }

        // Saves imageUrl for deletion
        String imageUrl = "";
        if (productVariant.getImageUrl() != null) {
            imageUrl = productVariant.getImageUrl();
        }

        // Unique users which carts contain removed product variant
        Set<String> cartOwners = new HashSet<>();

        // Removes reference to removed product variant in items
        itemRepository.findAllByProductVariant_Id(productVariant.getId())
                .forEach(item -> {
                    item.setProductVariant(null);
                    cartOwners.add(item.getCart().getCreatedBy());
                });
        productVariantRepository.delete(productVariant);

        if (!imageUrl.isEmpty()) {
            try {
                s3ImageService.removeImageFromS3(imageUrl);
            } catch (SdkClientException e) {
                throw new FailedToRemoveFileException(
                        FAILED_TO_REMOVE_FILE.name(),
                        FAILED_TO_REMOVE_FILE.getHttpStatus(),
                        "Could not remove image from the cloud storage",
                        e
                );
            }
        }

        clearOwnerProductsCache(authentication.getName(), productRedisTemplate);
        clearProductFeedbacksCache(productId, feedbackRedisTemplate);
        cartOwners.forEach(owner -> clearOwnerCartsCache(owner, cartRedisTemplate));
    }

    @PreAuthorize("hasRole('USER') && !hasRole('ADMIN')")
    public ProductVariantResponseDTO setProductVariantImage(Integer productId, Integer
            productVariantId, MultipartFile file, Authentication authentication) {
        if (file == null || file.isEmpty()) {
            throw new MissingFileException(
                    MISSING_FILE.name(),
                    MISSING_FILE.getHttpStatus(),
                    "Expected an image file named 'file', but none was found"
            );
        }

        Product product = productRepository.findProductById(productId)
                .orElseThrow(() -> new ProductNotFoundException(
                        PRODUCT_NOT_FOUND.name(),
                        PRODUCT_NOT_FOUND.getHttpStatus(),
                        String.format("Product with the ID: %d was not found", productId)
                ));

        if (!authentication.getName().equals(product.getCreatedBy())) {
            throw new UnauthorizedProductActionException(
                    UNAUTHORIZED_PRODUCT_ACTION.name(),
                    UNAUTHORIZED_PRODUCT_ACTION.getHttpStatus(),
                    String.format("Only the owner can save the image for the product variant with the ID: %d", productId)
            );
        }

        ProductVariant productVariant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new ProductVariantNotFoundException(
                        PRODUCT_VARIANT_NOT_FOUND.name(),
                        PRODUCT_VARIANT_NOT_FOUND.getHttpStatus(),
                        String.format("Product variant with the ID: %d was not found", productVariantId)
                ));

        // Straight Jean.avif -> 1752533249916_Straight_Jean.avif
        String fileName = System.currentTimeMillis() + "_" + Objects.requireNonNull(file.getOriginalFilename()).replace(" ", "_");
        try {
            if (productVariant.getImageUrl() != null) {
                s3ImageService.removeImageFromS3(productVariant.getImageUrl());
            }

            s3ImageService.createImageOnS3(fileName, file);
        } catch (IOException | SdkClientException e) {
            throw new FailedToReadFileException(
                    FAILED_TO_READ_FILE.name(),
                    FAILED_TO_READ_FILE.getHttpStatus(),
                    "Failed to process the uploaded file - it may be corrupted or unreadable",
                    e
            );
        }

        productVariant.setImageUrl(s3ImageService.fileNameToImageUrl(fileName));
        // There is no point of removing referenced owners cart caches,
        // image in item is stored in ProductVariantSnapshot which is set once during creation of the item
        clearOwnerProductsCache(authentication.getName(), productRedisTemplate);

        return productVariantMapper.toProductVariantResponseDTO(productVariantRepository.save(productVariant));
    }

    @PreAuthorize("hasRole('USER') && !hasRole('ADMIN')")
    public void removeProductVariantImageById(Integer productId, Integer productVariantId, Authentication
            authentication) {
        Product product = productRepository.findProductById(productId)
                .orElseThrow(() -> new ProductNotFoundException(
                        PRODUCT_NOT_FOUND.name(),
                        PRODUCT_NOT_FOUND.getHttpStatus(),
                        String.format("Product with the ID: %d was not found", productId)
                ));

        if (!authentication.getName().equals(product.getCreatedBy())) {
            throw new UnauthorizedProductActionException(
                    UNAUTHORIZED_PRODUCT_ACTION.name(),
                    UNAUTHORIZED_PRODUCT_ACTION.getHttpStatus(),
                    String.format("Only the owner can remove the image in the product variant with the ID: %d", productId)
            );
        }

        ProductVariant productVariant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new ProductVariantNotFoundException(
                        PRODUCT_VARIANT_NOT_FOUND.name(),
                        PRODUCT_VARIANT_NOT_FOUND.getHttpStatus(),
                        String.format("Product variant with the ID: %d was not found", productVariantId)
                ));

        if (productVariant.getImageUrl() != null) {
            try {
                s3ImageService.removeImageFromS3(productVariant.getImageUrl());
            } catch (SdkClientException e) {
                throw new FailedToRemoveFileException(
                        FAILED_TO_REMOVE_FILE.name(),
                        FAILED_TO_REMOVE_FILE.getHttpStatus(),
                        "Could not remove image from the cloud storage",
                        e
                );
            }
        }

        productVariant.setImageUrl(null);
        productVariantRepository.save(productVariant);
        clearOwnerProductsCache(authentication.getName(), productRedisTemplate);
    }

    @PreAuthorize("hasRole('USER') && !hasRole('ADMIN')")
    public void updateProductVariantQuantity(Integer productId, Integer productVariantId, UpdateQuantityRequestDTO
            quantityDTO, Authentication authentication) {
        Product product = productRepository.findProductById(productId)
                .orElseThrow(() -> new ProductNotFoundException(
                        PRODUCT_NOT_FOUND.name(),
                        PRODUCT_NOT_FOUND.getHttpStatus(),
                        String.format("Product with the ID: %d was not found", productId)
                ));

        if (!authentication.getName().equals(product.getCreatedBy())) {
            throw new UnauthorizedProductActionException(
                    UNAUTHORIZED_PRODUCT_ACTION.name(),
                    UNAUTHORIZED_PRODUCT_ACTION.getHttpStatus(),
                    String.format("Only the owner can save the image for the product variant with the ID: %d", productId)
            );
        }

        ProductVariant productVariantToUpdate = product.getProductVariants().stream()
                .filter(variant -> variant.getId().equals(productVariantId))
                .findFirst()
                .orElseThrow(() -> new ProductVariantNotFoundException(
                        PRODUCT_VARIANT_NOT_FOUND.name(),
                        PRODUCT_VARIANT_NOT_FOUND.getHttpStatus(),
                        String.format("Product variant with the ID: %d was not found", productVariantId)
                ));

        if (productVariantToUpdate.getQuantity().equals(quantityDTO.quantity())) {
            throw new QuantityUnchangedException(
                    QUANTITY_UNCHANGED.name(),
                    QUANTITY_UNCHANGED.getHttpStatus(),
                    String.format("Product variant with the ID: %d has already quantity: %d", productVariantToUpdate.getId(), quantityDTO.quantity())
            );
        }

        productVariantToUpdate.setQuantity(quantityDTO.quantity());
        productVariantRepository.save(productVariantToUpdate);
        clearOwnerProductsCache(authentication.getName(), productRedisTemplate);

        // Clears caches in carts referencing this product variant because the new quantity can cause the stock to become less than
        // the quantity set in the item quantity
        itemRepository.findAllByProductVariant_Id(productVariantToUpdate.getId())
                .forEach(item -> clearOwnerCartsCache(item.getCart().getCreatedBy(), cartRedisTemplate));
    }

    @PreAuthorize("hasRole('USER') && !hasRole('ADMIN')")
    public void updateProductVariantPrice(Integer productId, Integer productVariantId, UpdatePriceRequestDTO
            quantityDTO, Authentication authentication) {
        Product product = productRepository.findProductById(productId)
                .orElseThrow(() -> new ProductNotFoundException(
                        PRODUCT_NOT_FOUND.name(),
                        PRODUCT_NOT_FOUND.getHttpStatus(),
                        String.format("Product with the ID: %d was not found", productId)
                ));

        if (!authentication.getName().equals(product.getCreatedBy())) {
            throw new UnauthorizedProductActionException(
                    UNAUTHORIZED_PRODUCT_ACTION.name(),
                    UNAUTHORIZED_PRODUCT_ACTION.getHttpStatus(),
                    String.format("Only the owner can save the image in the product variant with the ID: %d", productId)
            );
        }

        ProductVariant productVariantToUpdate = product.getProductVariants().stream()
                .filter(variant -> variant.getId().equals(productVariantId))
                .findFirst()
                .orElseThrow(() -> new ProductVariantNotFoundException(
                        PRODUCT_VARIANT_NOT_FOUND.name(),
                        PRODUCT_VARIANT_NOT_FOUND.getHttpStatus(),
                        String.format("Product variant with the ID: %d was not found", productVariantId)
                ));

        if (productVariantToUpdate.getPrice().equals(quantityDTO.price())) {
            throw new QuantityUnchangedException(
                    QUANTITY_UNCHANGED.name(),
                    QUANTITY_UNCHANGED.getHttpStatus(),
                    String.format("Product variant with the ID: %d has already price: %s", productVariantToUpdate.getId(), quantityDTO.price())
            );
        }

        productVariantToUpdate.setPrice(quantityDTO.price());
        productVariantRepository.save(productVariantToUpdate);
        clearOwnerProductsCache(authentication.getName(), productRedisTemplate);
    }
}