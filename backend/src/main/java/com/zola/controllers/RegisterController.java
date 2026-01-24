package com.zola.controllers;

import com.zola.dto.request.auth.RegisterRequest;
import com.zola.dto.request.otp.VerifyOtpRequest;
import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.AuthResponse;
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
@RequestMapping("auth/register")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RegisterController {

    AuthenticationService authenticationService;

    @PostMapping
    public ApiResponse<Void> register(@RequestBody @Valid RegisterRequest request) {
        authenticationService.register(request);
        return ApiResponse.<Void>builder()
                .message("OTP has been sent to your email. Please verify to complete registration.")
                .build();
    }

    @PostMapping("/verify")
    public ApiResponse<AuthResponse> verify(@RequestBody @Valid VerifyOtpRequest request) {
        return ApiResponse.<AuthResponse>builder()
                .result(authenticationService.verifyRegister(request.getEmail(), request.getOtpCode()))
                .build();
    }
}
