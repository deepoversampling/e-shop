package com.javuar.shop.exception.exceptions.feedback;

import com.javuar.shop.exception.BaseException;
import org.springframework.http.HttpStatus;

public class UnauthorizedFeedbackActionException extends BaseException {
    public UnauthorizedFeedbackActionException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
