package com.zola.controllers;

import com.zola.dto.request.auth.password.ChangePasswordRequest;
import com.zola.dto.request.auth.password.VerifyChangePasswordOtpRequest;
import com.zola.dto.request.profile.*;
import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.profile.UserProfileResponse;
import com.zola.services.profile.UserProfileService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("profile")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileController {

    UserProfileService userProfileService;

    @GetMapping("/my")
    public ApiResponse<UserProfileResponse> getMyProfile() {
        return ApiResponse.<UserProfileResponse>builder()
                .result(userProfileService.getMyProfile())
                .build();
    }

    @PatchMapping("/update")
    public ApiResponse<UserProfileResponse> updateProfile(@RequestBody @Valid UpdateProfileRequest request) {
        return ApiResponse.<UserProfileResponse>builder()
                .result(userProfileService.updateProfile(request))
                .build();
    }

    @PostMapping("/send-change-password-otp")
    public ApiResponse<Void> sendChangePasswordOtp() {
        userProfileService.sendChangePasswordOtp();
        return ApiResponse.<Void>builder()
                .message("OTP has been sent to your email.")
                .build();
    }

    @PostMapping("/verify-change-password-otp")
    public ApiResponse<String> verifyChangePasswordOtp(@RequestBody @Valid VerifyChangePasswordOtpRequest request) {
        return ApiResponse.<String>builder()
                .result(userProfileService.verifyChangePasswordOtp(request.getOtpCode()))
                .build();
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        userProfileService.changePassword(request);
        return ApiResponse.<Void>builder()
                .message("Password changed successfully")
                .build();
    }

    @PostMapping("/change-email")
    public ApiResponse<Void> changeEmail(@RequestBody @Valid ChangeEmailRequest request) {
        userProfileService.changeEmail(request);
        return ApiResponse.<Void>builder()
                .message("Email changed successfully")
                .build();
    }

    @PostMapping("/change-phone")
    public ApiResponse<Void> changePhone(@RequestBody @Valid ChangePhoneRequest request) {
        userProfileService.changePhone(request);
        return ApiResponse.<Void>builder()
                .message("Phone number changed successfully")
                .build();
    }

    @PostMapping("/upload-avatar")
    public ApiResponse<String> uploadAvatar(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<String>builder()
                .result(userProfileService.uploadAvatar(file))
                .build();
    }
}
