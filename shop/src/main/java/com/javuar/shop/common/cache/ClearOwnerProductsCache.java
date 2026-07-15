package com.javuar.shop.common.cache;

import com.javuar.shop.product.ProductResponseDTO;
import lombok.experimental.UtilityClass;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Set;

@UtilityClass
public class ClearOwnerProductsCache {

    public void clearOwnerProductsCache(String username, RedisTemplate<String, List<ProductResponseDTO>> productRedisTemplate) {
        Set<String> keys = productRedisTemplate.keys("ownerProducts::" + username);
        if (!CollectionUtils.isEmpty(keys)) {
            productRedisTemplate.delete(keys);
        }
    }
}