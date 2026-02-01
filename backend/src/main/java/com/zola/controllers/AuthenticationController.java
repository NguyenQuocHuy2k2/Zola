package com.zola.controllers;

import com.zola.dto.request.auth.password.ResetPasswordRequest;
import com.zola.dto.request.auth.password.ForgotPasswordInitRequest;
import com.zola.dto.request.auth.IntrospectRequest;
import com.zola.dto.request.auth.LoginRequest;
import com.zola.dto.request.auth.LogoutRequest;
import com.zola.dto.request.auth.RefreshTokenRequest;
import com.zola.dto.request.auth.RegisterRequest;
import com.zola.dto.request.auth.password.VerifyForgotPasswordOtpRequest;
import com.zola.dto.response.auth.ResetTokenResponse;
import com.zola.dto.request.otp.VerifyOtpRequest;
import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.auth.AuthResponse;
import com.zola.dto.response.auth.IntrospectResponse;
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
public class AuthenticationController {

    AuthenticationService authenticationService;

    @PostMapping("/register")
    public ApiResponse<Void> register(@RequestBody @Valid RegisterRequest request) {
        authenticationService.register(request);
        return ApiResponse.<Void>builder()
                .message("OTP has been sent to your email. Please verify to complete registration.")
                .build();
    }

    @PostMapping("/register/verify")
    public ApiResponse<AuthResponse> verify(@RequestBody @Valid VerifyOtpRequest request) {
        return ApiResponse.<AuthResponse>builder()
                .result(authenticationService.verifyRegister(request.getEmail(), request.getOtpCode()))
                .build();
    }

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

    @PostMapping("/forgot-password/verify")
    public ApiResponse<ResetTokenResponse> verifyForgotPasswordOtp(@RequestBody @Valid VerifyForgotPasswordOtpRequest request) {
        String resetToken = authenticationService.verifyForgotPasswordOtp(request.getIdentifier(), request.getOtpCode());
        return ApiResponse.<ResetTokenResponse>builder()
                .result(ResetTokenResponse.builder()
                        .resetToken(resetToken)
                        .build())
                .message("OTP verified successfully.")
                .build();
    }

    @PostMapping("/forgot-password/reset")
    public ApiResponse<Void> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        authenticationService.resetPassword(request);
        return ApiResponse.<Void>builder()
                .message("Password has been reset successfully")
                .build();
    }
}
