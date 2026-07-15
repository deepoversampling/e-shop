package com.javuar.shop.feedback;

import com.javuar.shop.feedback.validation.NoteConstraint;
import com.javuar.shop.feedback.validation.group_sequence.CustomGroup;
import com.javuar.shop.feedback.validation.group_sequence.DefaultGroup;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FeedbackRequestDTO(
        @NotNull(message = "Item ID cannot be null", groups = DefaultGroup.class)
        Integer itemId,

        @NotNull(message = "Note cannot be null", groups = DefaultGroup.class)
        @NoteConstraint(groups = CustomGroup.class)
        Double note,

        @NotEmpty(message = "Comment cannot be empty", groups = DefaultGroup.class)
        @Size(max=255, message = "Total length of a comment cannot exceed 255 characters", groups = DefaultGroup.class)
        String comment
) {}