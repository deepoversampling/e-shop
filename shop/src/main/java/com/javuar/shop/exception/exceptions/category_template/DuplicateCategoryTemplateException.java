package com.javuar.shop.exception.exceptions.category_template;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class DuplicateCategoryTemplateException extends BaseException {
    public DuplicateCategoryTemplateException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
