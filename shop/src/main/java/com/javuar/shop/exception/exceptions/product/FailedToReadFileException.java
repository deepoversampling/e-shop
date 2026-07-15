package com.javuar.shop.exception.exceptions.product;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class FailedToReadFileException extends BaseException {
    public FailedToReadFileException(String errorCode, HttpStatus httpStatus, String message, Throwable cause) {
        super(errorCode, httpStatus, message, cause);
    }
}
