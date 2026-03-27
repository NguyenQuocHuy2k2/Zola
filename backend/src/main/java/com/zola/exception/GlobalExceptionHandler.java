package com.zola.exception;

import com.zola.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import jakarta.servlet.http.HttpServletRequest;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    // Handle all uncategorized exceptions
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<?>> handlingRuntimeException(Exception exception, HttpServletRequest request) {
        log.error("Exception [{} {}]: ", request.getMethod(), request.getRequestURI(), exception);
        ErrorCode errorCode = ErrorCode.UNCATEGORIZED_EXCEPTION;
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(exception.getMessage())
                .build();

        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<?>> handlingAppException(AppException exception, HttpServletRequest request) {
        log.error("AppException [{} {}]: {}", request.getMethod(), request.getRequestURI(), exception.getMessage());
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse<?>> handlingAccessDeniedException(AccessDeniedException exception, HttpServletRequest request) {
        log.error("AccessDeniedException [{} {}]: {}", request.getMethod(), request.getRequestURI(), exception.getMessage());
        ErrorCode errorCode = ErrorCode.FORBIDDEN;
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = AuthenticationServiceException.class)
    ResponseEntity<ApiResponse<?>> handlingAuthenticationServiceException(AuthenticationServiceException exception, HttpServletRequest request) {
        log.error("AuthenticationServiceException [{} {}]: {}", request.getMethod(), request.getRequestURI(), exception.getMessage());
        ErrorCode errorCode = ErrorCode.UNAUTHENTICATED;
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(exception.getMessage()) // Return the specific message like "Token invalid"
                .build();

        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = JwtException.class)
    ResponseEntity<ApiResponse<?>> handlingJwtException(JwtException exception, HttpServletRequest request) {
        log.error("AuthenticationServiceException [{} {}]: {}", request.getMethod(), request.getRequestURI(), exception.getMessage());
        ErrorCode errorCode = ErrorCode.UNAUTHENTICATED;
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(exception.getMessage()) // Return the specific message like "Token invalid"
                .build();

        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<?>> handlingValidationException(MethodArgumentNotValidException exception, HttpServletRequest request) {
        log.error("ValidationException [{} {}]: {}", request.getMethod(), request.getRequestURI(), exception.getMessage());
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .findFirst()
                .orElse("Validation error");

        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code("validation-error")
                .message(message)
                .build();

        return ResponseEntity.badRequest().body(apiResponse);
    }
}
