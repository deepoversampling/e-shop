package com.javuar.shop.exception.exceptions.cart;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class DuplicateItemException extends BaseException {
    public DuplicateItemException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}