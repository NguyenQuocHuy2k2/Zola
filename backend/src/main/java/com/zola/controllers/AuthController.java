package com.zola.controllers;

import com.zola.dto.request.auth.IntrospectRequest;
import com.zola.dto.request.auth.LoginRequest;
import com.zola.dto.request.auth.ForgetPasswordRequest;
import com.zola.dto.request.auth.ForgotPasswordInitRequest;
import com.zola.dto.request.auth.LogoutRequest;
import com.zola.dto.request.auth.RefreshTokenRequest;
import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.AuthResponse;
import com.zola.dto.response.IntrospectResponse;
import com.zola.services.authentication.AuthenticationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

    AuthenticationService authenticationService;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        return ApiResponse.<AuthResponse>builder()
                .result(authenticationService.authenticate(request))
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody @Valid LogoutRequest request) {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .message("Logout successfully")
                .build();
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@RequestBody @Valid RefreshTokenRequest request) {
        return ApiResponse.<AuthResponse>builder()
                .result(authenticationService.refresh(request))
                .build();
    }

    @PostMapping("/introspect")
    public ApiResponse<IntrospectResponse> introspect(@RequestBody @Valid IntrospectRequest request) {
        return ApiResponse.<IntrospectResponse>builder()
                .result(authenticationService.introspect(request))
                .build();
    }

    @PostMapping("/forgot-password/init")
    public ApiResponse<String> initForgotPassword(@RequestBody @Valid ForgotPasswordInitRequest request) {
        String maskedEmail = authenticationService.initForgotPassword(request.getIdentifier());
        return ApiResponse.<String>builder()
                .result(maskedEmail)
                .message("OTP has been sent to your registered email.")
                .build();
    }

    @PostMapping("/forget-password")
    public ApiResponse<Void> forgetPassword(@RequestBody @Valid ForgetPasswordRequest request) {
        authenticationService.forgetPassword(request);
        return ApiResponse.<Void>builder()
                .message("Password has been reset successfully")
                .build();
    }
}
