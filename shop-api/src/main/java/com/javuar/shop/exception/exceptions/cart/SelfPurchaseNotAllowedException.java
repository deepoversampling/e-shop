package com.javuar.shop.exception.exceptions.cart;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class SelfPurchaseNotAllowedException extends BaseException {
    public SelfPurchaseNotAllowedException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
