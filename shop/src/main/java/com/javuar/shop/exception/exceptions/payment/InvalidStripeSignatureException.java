package com.javuar.shop.exception.exceptions.payment;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class InvalidStripeSignatureException extends BaseException {
    public InvalidStripeSignatureException(String errorCode, HttpStatus httpStatus, String message, Throwable cause) {
        super(errorCode, httpStatus, message, cause);
    }
}
