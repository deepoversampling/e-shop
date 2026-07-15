package com.javuar.shop.exception.handler;

import com.javuar.shop.exception.ExceptionResponseDTO;
import com.javuar.shop.exception.exceptions.cart.*;
import com.javuar.shop.exception.exceptions.category.CategoryNotFoundException;
import com.javuar.shop.exception.exceptions.category.DuplicateCategoryNameException;
import com.javuar.shop.exception.exceptions.category.DuplicateRootCategoryException;
import com.javuar.shop.exception.exceptions.category_template.CategoryTemplateNotFoundException;
import com.javuar.shop.exception.exceptions.category_template.CategoryTemplateReferencedException;
import com.javuar.shop.exception.exceptions.category_template.DuplicateCategoryTemplateException;
import com.javuar.shop.exception.exceptions.category_template.NonLeafCategoryException;
import com.javuar.shop.exception.exceptions.feedback.UnauthorizedFeedbackActionException;
import com.javuar.shop.exception.exceptions.payment.InvalidStripeSignatureException;
import com.javuar.shop.exception.exceptions.payment.StripeCustomerCreationException;
import com.javuar.shop.exception.exceptions.payment.StripeSessionCreationException;
import com.javuar.shop.exception.exceptions.product.*;
import com.javuar.shop.exception.exceptions.property.DuplicatePropertyNameException;
import com.javuar.shop.exception.exceptions.property.PropertyNotFoundException;
import com.javuar.shop.exception.exceptions.user.UserNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.javuar.shop.exception.BusinessErrorCodes.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Category
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(CategoryNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(DuplicateCategoryNameException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(DuplicateCategoryNameException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(DuplicateRootCategoryException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(DuplicateRootCategoryException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    //------------------------------------------------------------------------------------------------------------------

    // Property
    @ExceptionHandler(DuplicatePropertyNameException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(DuplicatePropertyNameException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(PropertyNotFoundException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(PropertyNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    //------------------------------------------------------------------------------------------------------------------

    // CategoryTemplate
    @ExceptionHandler(CategoryTemplateNotFoundException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(CategoryTemplateNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(DuplicateCategoryTemplateException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(DuplicateCategoryTemplateException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(NonLeafCategoryException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(NonLeafCategoryException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(CategoryTemplateReferencedException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(CategoryTemplateReferencedException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    //------------------------------------------------------------------------------------------------------------------

    // Product
    @ExceptionHandler(FailedToReadFileException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(FailedToReadFileException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(FailedToRemoveFileException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(FailedToRemoveFileException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(InvalidProductVariantFormatException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(InvalidProductVariantFormatException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(MissingFileException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(MissingFileException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(ProductNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(ProductVariantNotFoundException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(ProductVariantNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(UnauthorizedProductActionException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(UnauthorizedProductActionException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    //------------------------------------------------------------------------------------------------------------------

    // Cart
    @ExceptionHandler(CartFinalizedException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(CartFinalizedException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(CartNotFoundException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(CartNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(DuplicateItemException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(DuplicateItemException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(ItemNotFoundException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(ItemNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(OutOfStockException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(OutOfStockException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(QuantityUnchangedException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(QuantityUnchangedException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(SelfPurchaseNotAllowedException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(SelfPurchaseNotAllowedException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(UnauthorizedCartActionException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(UnauthorizedCartActionException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    // User
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(UserNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    // Payment
    @ExceptionHandler(InvalidStripeSignatureException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(InvalidStripeSignatureException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(StripeCustomerCreationException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(StripeCustomerCreationException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(StripeSessionCreationException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(StripeSessionCreationException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    // Feedback
    @ExceptionHandler(UnauthorizedFeedbackActionException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(UnauthorizedFeedbackActionException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ex.getErrorCode())
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    // -----------------------------------------------------------------------------------------------------------------

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(DataIntegrityViolationException ex, HttpServletRequest request) {
        String entityName = inferEntityName(ex.getMessage());

        return ResponseEntity
                .status(DATA_INTEGRITY_VIOLATION.getHttpStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(DATA_INTEGRITY_VIOLATION.name())
                        .status(DATA_INTEGRITY_VIOLATION.getHttpStatus().value())
                        .message(String.format("Cannot delete %s, it is still referenced", entityName))
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    // table \"category\" is actually table "category"
    // " has to be escaped in Regex
    private String inferEntityName(String exceptionMessage) {
        Matcher matcher = Pattern.compile("table \"(.*?)\"").matcher(exceptionMessage);
        return matcher.find() ? matcher.group(1) : "entity";
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Set<String> validationErrors = ex.getBindingResult().getAllErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toSet());
        return ResponseEntity
                .status(VALIDATION_ERROR.getHttpStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(VALIDATION_ERROR.name())
                        .status(VALIDATION_ERROR.getHttpStatus().value())
                        .validationErrors(validationErrors)
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(MissingServletRequestParameterException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(MISSING_REQUEST_PARAMETER.getHttpStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(MISSING_REQUEST_PARAMETER.name())
                        .status(MISSING_REQUEST_PARAMETER.getHttpStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(HttpMessageNotReadableException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(HTTP_MESSAGE_NOT_READABLE.getHttpStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(HTTP_MESSAGE_NOT_READABLE.name())
                        .status(HTTP_MESSAGE_NOT_READABLE.getHttpStatus().value())
                        .message("Required request body is missing")
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ExceptionResponseDTO> handleException(AccessDeniedException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(ACCESS_DENIED.getHttpStatus())
                .body(ExceptionResponseDTO.builder()
                        .errorCode(ACCESS_DENIED.name())
                        .status(ACCESS_DENIED.getHttpStatus().value())
                        .message(ex.getMessage())
                        .timestamp(Instant.now())
                        .path(request.getRequestURI())
                        .build());
    }
}