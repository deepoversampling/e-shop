package com.javuar.shop.exception.exceptions.property;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class DuplicatePropertyNameException extends BaseException {
    public DuplicatePropertyNameException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
