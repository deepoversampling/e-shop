package com.javuar.shop.property.validation.group_sequence;

import jakarta.validation.GroupSequence;

// Specifies the order of group validation
@GroupSequence({DefaultGroup.class, CustomGroup.class})
public interface PropertyValidationSequence {
}