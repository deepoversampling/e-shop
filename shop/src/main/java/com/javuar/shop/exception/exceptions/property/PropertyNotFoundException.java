package com.javuar.shop.exception.exceptions.property;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class PropertyNotFoundException extends BaseException {
    public PropertyNotFoundException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
