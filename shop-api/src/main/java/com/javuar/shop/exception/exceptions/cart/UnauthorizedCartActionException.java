package com.javuar.shop.exception.exceptions.cart;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class UnauthorizedCartActionException extends BaseException {
    public UnauthorizedCartActionException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
