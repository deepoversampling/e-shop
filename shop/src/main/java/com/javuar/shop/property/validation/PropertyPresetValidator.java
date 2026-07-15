package com.javuar.shop.property.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

import static com.javuar.shop.common.constants.RegexConstants.CONTINUOUS_PATTERN;

public class PropertyPresetValidator implements ConstraintValidator<PropertyPresetsConstraint, List<String>> {

    @Override
    public boolean isValid(List<String> presets, ConstraintValidatorContext context) {
        // Checks if the property is continuous (all presets are continuous)
        boolean isContinuous = presets.stream()
                .allMatch(preset -> preset.matches(CONTINUOUS_PATTERN.pattern()));

        if (isContinuous) {
            int i = 0;
            for (String preset : presets) {
                try {
                    String[] parts = preset.split("\\|");
                    double min = Double.parseDouble(parts[0]);
                    double max = Double.parseDouble(parts[1]);

                    if (min >= max) {
                        context.disableDefaultConstraintViolation();
                        context.buildConstraintViolationWithTemplate(String.format("Preset %s should have min value: %s that is less than max value: %s", preset, min, max))
                                .addConstraintViolation();
                        return false;
                    }
                    // Prevents collision between presets
                    if (i > 0) {
                        String[] prevParts = presets.get(i - 1).split("\\|");
                        double prevMax = Double.parseDouble(prevParts[1]);
                        if (min <= prevMax) {
                            context.disableDefaultConstraintViolation();
                            context.buildConstraintViolationWithTemplate(String.format("Preset %s should have min value: %s that is bigger than max value: %s in the previous preset: %s", preset, min, prevMax, presets.get(i - 1)))
                                    .addConstraintViolation();
                            return false;
                        }
                    }
                    i++;
                } catch (NumberFormatException e) {
                    context.disableDefaultConstraintViolation();
                    context.buildConstraintViolationWithTemplate("Unable to determine numeric value from one of the preset")
                            .addConstraintViolation();
                    return false;
                }
            }
        } else {
            for (String preset : presets) {
                if (preset.isBlank()) {
                    context.disableDefaultConstraintViolation();
                    context.buildConstraintViolationWithTemplate("Property preset cannot be blank")
                            .addConstraintViolation();
                    return false;
                }
                // Prevents usage of continuous format in any non-continuous preset e.g. "wood", "metal", "1-3
                if (preset.matches(CONTINUOUS_PATTERN.pattern())) {
                    context.disableDefaultConstraintViolation();
                    context.buildConstraintViolationWithTemplate(String.format("Discrete preset: %s cannot use continuous preset format (e.g., '1-3')", preset))
                            .addConstraintViolation();
                    return false;
                }
            }
        }
        return true;
    }
}