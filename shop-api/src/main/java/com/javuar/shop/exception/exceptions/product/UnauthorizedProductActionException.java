package com.javuar.shop.exception.exceptions.product;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class UnauthorizedProductActionException extends BaseException {
    public UnauthorizedProductActionException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
