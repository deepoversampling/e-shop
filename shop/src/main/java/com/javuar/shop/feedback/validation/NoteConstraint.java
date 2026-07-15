package com.javuar.shop.feedback.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Constraint(validatedBy = NoteValidator.class)
@Target({FIELD})
@Retention(RUNTIME)
public @interface NoteConstraint {
    String message() default "Note must be between 0 and 5, increasing in steps of 0.5";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}