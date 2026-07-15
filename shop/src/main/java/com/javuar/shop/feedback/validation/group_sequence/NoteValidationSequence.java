package com.javuar.shop.feedback.validation.group_sequence;

import jakarta.validation.GroupSequence;

// Specifies the order of group validation
@GroupSequence({DefaultGroup.class, CustomGroup.class})
public interface NoteValidationSequence {
}