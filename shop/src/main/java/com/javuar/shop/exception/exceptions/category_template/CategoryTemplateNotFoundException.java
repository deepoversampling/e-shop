package com.javuar.shop.exception.exceptions.category_template;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class CategoryTemplateNotFoundException extends BaseException {
    public CategoryTemplateNotFoundException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
