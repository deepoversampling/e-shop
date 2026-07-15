package com.javuar.shop.common.cache;

import com.javuar.shop.feedback.FeedbackResponseDTO;
import lombok.experimental.UtilityClass;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Set;

@UtilityClass
public class ClearCartFeedbacksCache {

    public void clearCartFeedbacksCache(Integer cartId, RedisTemplate<String, List<FeedbackResponseDTO>> cartFeedbacksRedisTemplate) {
        Set<String> keys = cartFeedbacksRedisTemplate.keys("cartFeedbacks::" + cartId);
        if (!CollectionUtils.isEmpty(keys)) {
            cartFeedbacksRedisTemplate.delete(keys);
        }
    }
}