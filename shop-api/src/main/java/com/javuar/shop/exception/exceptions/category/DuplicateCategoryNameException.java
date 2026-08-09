package com.javuar.shop.exception.exceptions.category;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class DuplicateCategoryNameException extends BaseException {
    public DuplicateCategoryNameException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
