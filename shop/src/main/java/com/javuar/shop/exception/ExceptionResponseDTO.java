package com.javuar.shop.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

import java.time.Instant;
import java.util.Set;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ExceptionResponseDTO(
        String errorCode,
        int status,
        String message,
        Set<String> validationErrors,
        Instant timestamp,
        String path
) {}