package com.zola.services.profile;

import com.zola.dto.request.auth.password.ChangePasswordRequest;
import com.zola.dto.request.profile.*;
import com.zola.dto.response.profile.UserProfileResponse;
import com.zola.entity.User;
import com.zola.enums.OtpType;
import com.zola.exception.AppException;
import com.zola.exception.ErrorCode;
import com.zola.mapper.UserMapper;
import com.zola.repository.UserRepository;
import com.zola.services.cloudinary.CloudinaryService;
import com.zola.services.otp.OtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import com.zola.utils.SecurityUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileServiceImpl implements UserProfileService {

    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    OtpService otpService;
    CloudinaryService cloudinaryService;
    StringRedisTemplate redisTemplate;

    @Override
    public UserProfileResponse getMyProfile() {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserProfileResponse(user);
    }

    @Override
    public UserProfileResponse updateProfile(UpdateProfileRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.getFirstName() != null)
            user.setFirstName(request.getFirstName());
        if (request.getLastName() != null)
            user.setLastName(request.getLastName());
        if (request.getPhone() != null) {
            // Check if phone already taken by another user
            if (userRepository.existsByPhone(request.getPhone())) {
                // throw error if it's not the same user
                User existing = userRepository.findByPhone(request.getPhone()).get();
                if (!existing.getId().equals(user.getId())) {
                    throw new AppException(ErrorCode.USER_EXISTED);
                }
            }
            user.setPhone(request.getPhone());
        }
        if (request.getAvatarUrl() != null)
            user.setAvatarUrl(request.getAvatarUrl());

        userRepository.save(user);
        return userMapper.toUserProfileResponse(user);
    }

    @Override
    public void sendChangePasswordOtp() {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        otpService.sendOtp(user.getEmail(), OtpType.CHANGE_PASSWORD);
    }

    @Override
    public String verifyChangePasswordOtp(String otpCode) {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!otpService.verifyOtp(user.getEmail(), otpCode, OtpType.CHANGE_PASSWORD)) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        String changeToken = java.util.UUID.randomUUID().toString();
        String redisKey = "change-password:token:" + userId;
        redisTemplate.opsForValue().set(redisKey, changeToken, 5, java.util.concurrent.TimeUnit.MINUTES);

        return changeToken;
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 1. Verify change token
        String redisKey = "change-password:token:" + userId;
        String storedToken = redisTemplate.opsForValue().get(redisKey);
        if (storedToken == null || !storedToken.equals(request.getChangeToken())) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        // 2. Verify old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INCORRECT_PASSWORD);
        }

        // 3. Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // 4. Consume token
        redisTemplate.delete(redisKey);
    }

    @Override
    public void changeEmail(ChangeEmailRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INCORRECT_PASSWORD);
        }

        if (!otpService.verifyOtp(request.getNewEmail(), request.getOtpCode(), OtpType.CHANGE_EMAIL)) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        user.setEmail(request.getNewEmail());
        userRepository.save(user);
    }

    @Override
    public void changePhone(ChangePhoneRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Note: ChangePhoneRequest doesn't have currentPassword in my DTO,
        // usually it's better to have it but I'll follow my DTO for now.

        // For phone change, we usually verify OTP on the NEW phone.
        // My OtpService.verifyOtp takes email, but for phone I should probably use
        // phone.
        // I'll assume the SendOtpRequest.email field can hold phone number for this
        // type.
        // Or I should have updated OtpCode to hold an identifier.
        // Given the requirement is "email (có xác thực OTP)", I'll stick to email OTP
        // mostly.
        // If user wants phone OTP, I'd need an SMS service.

        if (!otpService.verifyOtp(user.getEmail(), request.getOtpCode(), OtpType.CHANGE_PHONE)) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        user.setPhone(request.getNewPhone());
        userRepository.save(user);
    }

    @Override
    public String uploadAvatar(MultipartFile file) {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        try {
            String secureUrl = cloudinaryService.uploadImage(file, "zola/avatars", "avatar_" + userId);
            
            user.setAvatarUrl(secureUrl);
            userRepository.save(user);
            return secureUrl;

        } catch (IOException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }
}
