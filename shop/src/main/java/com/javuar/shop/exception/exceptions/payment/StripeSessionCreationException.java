package com.javuar.shop.exception.exceptions.payment;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class StripeSessionCreationException extends BaseException {
    public StripeSessionCreationException(String errorCode, HttpStatus httpStatus, String message, Throwable cause) {
        super(errorCode, httpStatus, message, cause);
    }
}