package com.javuar.shop.config;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.javuar.shop.cart.CartResponseDTO;
import com.javuar.shop.category.CategoryResponseDTO;
import com.javuar.shop.category_template.CategoryTemplateResponseDTO;
import com.javuar.shop.common.pagination.PageResponse;
import com.javuar.shop.feedback.FeedbackResponseDTO;
import com.javuar.shop.product.ProductResponseDTO;
import com.javuar.shop.property.PropertyResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.time.Duration;
import java.util.*;

@Configuration
public class BeansConfig {

    @Value("${spring.jpa.cors.origins}")
    private List<String> allowedOrigins;

    @Bean
    public AuditorAware<String> auditorAware() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getName);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList(HttpHeaders.CONTENT_TYPE, HttpHeaders.AUTHORIZATION));
        configuration.setExposedHeaders(List.of("Location"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Bean
    public Jackson2JsonRedisSerializer<CategoryResponseDTO> rootCategorySerializer() {
        return new Jackson2JsonRedisSerializer<>(CategoryResponseDTO.class);
    }

    @Bean
    public RedisCacheConfiguration rootCategoryCacheConfiguration(Jackson2JsonRedisSerializer<CategoryResponseDTO> rootCategorySerializer) {
        return RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(rootCategorySerializer))
                .entryTtl(Duration.ofMinutes(30))
                .disableCachingNullValues();
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    @Bean
    public Jackson2JsonRedisSerializer<PropertyResponseDTO> propertySerializer() {
        return new Jackson2JsonRedisSerializer<>(PropertyResponseDTO.class);
    }

    @Bean
    public RedisCacheConfiguration propertyCacheConfiguration(Jackson2JsonRedisSerializer<PropertyResponseDTO> propertySerializer) {
        return RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(propertySerializer))
                .entryTtl(Duration.ofMinutes(30))
                .disableCachingNullValues();
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    @Bean
    public Jackson2JsonRedisSerializer<CategoryTemplateResponseDTO> categoryTemplateSerializer() {
        return new Jackson2JsonRedisSerializer<>(CategoryTemplateResponseDTO.class);
    }

    @Bean
    public RedisCacheConfiguration categoryTemplateCacheConfiguration(Jackson2JsonRedisSerializer<CategoryTemplateResponseDTO> categoryTemplateSerializer) {
        return RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(categoryTemplateSerializer))
                .entryTtl(Duration.ofMinutes(30))
                .disableCachingNullValues();
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    @Bean
    public Jackson2JsonRedisSerializer<List<ProductResponseDTO>> ownerProductsSerializer() {
        ObjectMapper objectMapper = new ObjectMapper();

        JavaType listType = objectMapper.getTypeFactory() // Explicitly describe List<ProductResponseDTO> so Jackson can deserialize it despite type erasure
                .constructCollectionType(List.class, ProductResponseDTO.class);

        return new Jackson2JsonRedisSerializer<>(objectMapper, listType);
    }

    @Bean
    public RedisCacheConfiguration ownerProductsCacheConfiguration(Jackson2JsonRedisSerializer<List<ProductResponseDTO>> ownerProductsSerializer) {
        return RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(ownerProductsSerializer))
                .entryTtl(Duration.ofMinutes(30))
                .disableCachingNullValues();
    }

    @Bean
    public RedisTemplate<String, List<ProductResponseDTO>> ownerProductsRedisTemplate(
            RedisConnectionFactory connectionFactory,
            Jackson2JsonRedisSerializer<List<ProductResponseDTO>> productSerializer) {

        RedisTemplate<String, List<ProductResponseDTO>> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(productSerializer);

        return template;
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    @Bean
    public Jackson2JsonRedisSerializer<List<CartResponseDTO>> ownerCartsSerializer() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        JavaType listType = objectMapper.getTypeFactory()
                .constructCollectionType(List.class, CartResponseDTO.class);

        return new Jackson2JsonRedisSerializer<>(objectMapper, listType);
    }

    @Bean
    public RedisCacheConfiguration ownerCartsCacheConfiguration(Jackson2JsonRedisSerializer<List<CartResponseDTO>> ownerCartsSerializer) {
        return RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(ownerCartsSerializer))
                .entryTtl(Duration.ofMinutes(30))
                .disableCachingNullValues();
    }

    @Bean
    public RedisTemplate<String, List<CartResponseDTO>> ownerCartsRedisTemplate(
            RedisConnectionFactory connectionFactory,
            Jackson2JsonRedisSerializer<List<CartResponseDTO>> cartSerializer) {

        RedisTemplate<String, List<CartResponseDTO>> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(cartSerializer);

        return template;
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    @Bean
    public Jackson2JsonRedisSerializer<PageResponse<FeedbackResponseDTO>> productFeedbacksSerializer() {
        JavaType javaType = new ObjectMapper().getTypeFactory()
                .constructParametricType(PageResponse.class, FeedbackResponseDTO.class);

        return new Jackson2JsonRedisSerializer<>(javaType);
    }

    @Bean
    public RedisCacheConfiguration productFeedbacksCacheConfiguration(Jackson2JsonRedisSerializer<PageResponse<FeedbackResponseDTO>> productFeedbacksSerializer) {
        return RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(productFeedbacksSerializer))
                .entryTtl(Duration.ofMinutes(30))
                .disableCachingNullValues();
    }

    @Bean
    public RedisTemplate<String, PageResponse<FeedbackResponseDTO>> productFeedbacksRedisTemplate(
            RedisConnectionFactory connectionFactory,
            Jackson2JsonRedisSerializer<PageResponse<FeedbackResponseDTO>> feedbackSerializer) {

        RedisTemplate<String, PageResponse<FeedbackResponseDTO>> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(feedbackSerializer);

        return template;
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    @Bean
    public Jackson2JsonRedisSerializer<List<FeedbackResponseDTO>> cartFeedbacksSerializer() {
        ObjectMapper objectMapper = new ObjectMapper();

        JavaType listType = objectMapper.getTypeFactory()
                .constructCollectionType(List.class, FeedbackResponseDTO.class);

        return new Jackson2JsonRedisSerializer<>(objectMapper, listType);
    }

    @Bean
    public RedisCacheConfiguration cartFeedbacksCacheConfiguration(Jackson2JsonRedisSerializer<List<FeedbackResponseDTO>> cartFeedbacksSerializer) {
        return RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(cartFeedbacksSerializer))
                .entryTtl(Duration.ofMinutes(30))
                .disableCachingNullValues();
    }

    @Bean
    public RedisTemplate<String, List<FeedbackResponseDTO>> carFeedbackstRedisTemplate(
            RedisConnectionFactory connectionFactory,
            Jackson2JsonRedisSerializer<List<FeedbackResponseDTO>> cartFeedbacksSerializer) {

        RedisTemplate<String, List<FeedbackResponseDTO>> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(cartFeedbacksSerializer);

        return template;
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    @Bean
    public CacheManager cacheManager(
            RedisConnectionFactory connectionFactory,
            RedisCacheConfiguration rootCategoryCacheConfiguration,
            RedisCacheConfiguration propertyCacheConfiguration,
            RedisCacheConfiguration categoryTemplateCacheConfiguration,
            RedisCacheConfiguration ownerProductsCacheConfiguration,
            RedisCacheConfiguration ownerCartsCacheConfiguration,
            RedisCacheConfiguration productFeedbacksCacheConfiguration,
            RedisCacheConfiguration cartFeedbacksCacheConfiguration) {

        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
        cacheConfigs.put("rootCategory", rootCategoryCacheConfiguration);
        cacheConfigs.put("property", propertyCacheConfiguration);
        cacheConfigs.put("categoryTemplate", categoryTemplateCacheConfiguration);
        cacheConfigs.put("ownerProducts", ownerProductsCacheConfiguration);
        cacheConfigs.put("ownerCarts", ownerCartsCacheConfiguration);
        cacheConfigs.put("productFeedbacks", productFeedbacksCacheConfiguration);
        cacheConfigs.put("cartFeedbacks", cartFeedbacksCacheConfiguration);

        return RedisCacheManager.builder(connectionFactory)
                .withInitialCacheConfigurations(cacheConfigs)
                .transactionAware()
                .build();
    }

}