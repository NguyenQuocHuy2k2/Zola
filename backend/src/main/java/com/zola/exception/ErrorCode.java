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
    FORBIDDEN("forbidden", "You do not have permission to access this resource", HttpStatus.FORBIDDEN),
    USER_NOT_FOUND("user-not-found", "User not found", HttpStatus.NOT_FOUND),
    USER_NOT_ACTIVE("user-not-active", "User is not active", HttpStatus.FORBIDDEN),
    INVALID_OTP("invalid-otp", "Invalid OTP code", HttpStatus.BAD_REQUEST),
    OTP_EXPIRED("otp-expired", "OTP code has expired", HttpStatus.BAD_REQUEST),
    INCORRECT_PASSWORD("incorrect-password", "Incorrect password", HttpStatus.BAD_REQUEST),
    SAME_PASSWORD("same-password", "New password cannot be the same as old password", HttpStatus.BAD_REQUEST),
    ADDRESS_NOT_FOUND("address-not-found", "Address not found", HttpStatus.NOT_FOUND),
    TOO_MANY_REQUESTS("too-many-requests", "Too many failed attempts. Please try again later.", HttpStatus.TOO_MANY_REQUESTS),
    INVALID_TOKEN("invalid-token", "Invalid or expired reset token.", HttpStatus.BAD_REQUEST),
    CART_ITEM_NOT_FOUND("cart-item-not-found", "Một số sản phẩm không tồn tại trong giỏ hàng", HttpStatus.NOT_FOUND),
    INVALID_CHECKOUT_REQUEST("invalid-checkout-request", "Danh sách sản phẩm thanh toán không được để trống", HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND("order-not-found", "Đơn hàng không tồn tại", HttpStatus.NOT_FOUND),
    ORDER_CANNOT_CANCEL("order-cannot-cancel", "Đơn hàng không thể hủy ở trạng thái hiện tại", HttpStatus.BAD_REQUEST),
    ORDER_CANCEL_TIME_EXCEEDED("order-cancel-time-exceeded", "Đã hết thời gian cho phép hủy đơn hàng (30 phút)", HttpStatus.BAD_REQUEST),
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
