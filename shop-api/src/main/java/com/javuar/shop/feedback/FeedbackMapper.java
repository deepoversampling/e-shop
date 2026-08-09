package com.javuar.shop.feedback;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FeedbackMapper {
    public FeedbackResponseDTO toFeedbackResponseDTO(Feedback feedback) {
        return FeedbackResponseDTO.builder()
                .id(feedback.getId())
                .note(feedback.getNote())
                .comment(feedback.getComment())
                .productVariantId(feedback.getProductVariant().getId())
                .build();
    }
}