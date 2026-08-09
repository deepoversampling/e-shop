package com.javuar.shop.exception.exceptions.product;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class ProductVariantNotFoundException extends BaseException {
    public ProductVariantNotFoundException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
