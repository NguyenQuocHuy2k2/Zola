package com.zola.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    SUCCESS("success", "Success", HttpStatus.OK),

    UNCATEGORIZED_EXCEPTION("uncategorized-exception", "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY("invalid-key", "Uncategorized error", HttpStatus.BAD_REQUEST),
    PASSWORD_MISMATCH("password-mismatch", "Password and Confirm Password do not match", HttpStatus.BAD_REQUEST),
    USER_EXISTED("user-existed", "User already exists", HttpStatus.BAD_REQUEST),
    ROLE_NOT_EXISTED("role-not-existed", "Role not found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED("unauthenticated", "Authentication is required", HttpStatus.UNAUTHORIZED),
    USER_NOT_FOUND("user-not-found", "User not found", HttpStatus.NOT_FOUND),
    USER_NOT_ACTIVE("user-not-active", "User is not active", HttpStatus.FORBIDDEN),
    INVALID_OTP("invalid-otp", "Invalid OTP code", HttpStatus.BAD_REQUEST),
    OTP_EXPIRED("otp-expired", "OTP code has expired", HttpStatus.BAD_REQUEST),
    INCORRECT_PASSWORD("incorrect-password", "Incorrect password", HttpStatus.BAD_REQUEST),
    SAME_PASSWORD("same-password", "New password cannot be the same as old password", HttpStatus.BAD_REQUEST),
    ADDRESS_NOT_FOUND("address-not-found", "Address not found", HttpStatus.NOT_FOUND),
    ;

    ErrorCode(String code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    String code;
    String message;
    HttpStatusCode statusCode;
}
