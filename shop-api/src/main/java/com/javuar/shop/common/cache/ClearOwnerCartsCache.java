package com.javuar.shop.common.cache;

import com.javuar.shop.cart.CartResponseDTO;
import lombok.experimental.UtilityClass;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Set;

@UtilityClass
public class ClearOwnerCartsCache {

    public void clearOwnerCartsCache(String username, RedisTemplate<String, List<CartResponseDTO>> cartRedisTemplate) {
        Set<String> keys = cartRedisTemplate.keys("ownerCarts::" + username);
        if (!CollectionUtils.isEmpty(keys)) {
            cartRedisTemplate.delete(keys);
        }
    }
}