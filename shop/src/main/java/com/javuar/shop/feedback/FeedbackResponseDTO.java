package com.javuar.shop.feedback;

import lombok.Builder;

@Builder
public record FeedbackResponseDTO(
        Integer id,
        Double note,
        String comment,
        Integer productVariantId
) { }