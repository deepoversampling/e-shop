package com.javuar.shop.common.cache;

import com.javuar.shop.common.pagination.PageResponse;
import com.javuar.shop.feedback.FeedbackResponseDTO;
import lombok.experimental.UtilityClass;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.util.CollectionUtils;

import java.util.Set;

@UtilityClass
public class ClearProductFeedbacksCache {

    public void clearProductFeedbacksCache(Integer productId, RedisTemplate<String, PageResponse<FeedbackResponseDTO>> feedbackRedisTemplate) {
        Set<String> keys = feedbackRedisTemplate.keys("productFeedbacks::" + productId + "*");
        if (!CollectionUtils.isEmpty(keys)) {
            feedbackRedisTemplate.delete(keys);
        }
    }
}