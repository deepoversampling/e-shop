package com.javuar.shop.exception.exceptions.payment;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class StripeCustomerCreationException extends BaseException {
    public StripeCustomerCreationException(String errorCode, HttpStatus httpStatus, String message, Throwable cause) {
        super(errorCode, httpStatus, message, cause);
    }
}