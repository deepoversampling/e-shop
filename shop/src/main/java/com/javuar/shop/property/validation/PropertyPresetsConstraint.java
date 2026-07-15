package com.javuar.shop.property.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Constraint(validatedBy = PropertyPresetValidator.class)
@Target({FIELD})
@Retention(RUNTIME)
public @interface PropertyPresetsConstraint {
    // Message used if the ConstraintValidatorContext was not modified
    String message() default "Property presets must be either continuous ranges (e.g., '1|3') or discrete values (e.g., 'XL')";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}