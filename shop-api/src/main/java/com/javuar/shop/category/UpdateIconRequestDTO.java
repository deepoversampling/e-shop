package com.javuar.shop.category;

import jakarta.validation.constraints.NotNull;

public record UpdateIconRequestDTO(
        @NotNull(message = "Icon cannot be null")
        String icon
) {}