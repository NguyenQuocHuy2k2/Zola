package com.zola.controllers;

import com.zola.dto.request.otp.SendOtpRequest;
import com.zola.dto.response.ApiResponse;
import com.zola.services.otp.OtpService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("otp")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OtpController {

    OtpService otpService;

    @PostMapping("/send")
    public ApiResponse<Void> sendOtp(@RequestBody @Valid SendOtpRequest request) {
        otpService.sendOtp(request.getEmail(), request.getType());
        return ApiResponse.<Void>builder()
                .message("OTP has been sent to your email.")
                .build();
    }
}
