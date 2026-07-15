package com.javuar.shop.feedback.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NoteValidator implements ConstraintValidator<NoteConstraint, Double> {
    
    @Override
    public boolean isValid(Double note, ConstraintValidatorContext context) {
        if (note < 0) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Note must be at least 0")
                    .addConstraintViolation();
            return false;
        } else if (note > 5) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Note must be at most 5")
                    .addConstraintViolation();
            return false;
        } else if (note % 0.5 != 0) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Note must be in 0.5 increments")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}