package com.zola.services.otp;

import com.zola.entity.OtpCode;
import com.zola.enums.OtpType;
import com.zola.repository.OtpCodeRepository;
import com.zola.services.email.EmailService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OtpServiceImpl implements OtpService {

    OtpCodeRepository otpCodeRepository;
    EmailService emailService;
    SecureRandom secureRandom = new SecureRandom();

    @NonFinal
    @Value("${otp.expiration:5}")
    int otpExpirationMinutes;

    @Override
    @Transactional
    public void sendOtp(String email, OtpType type) {
        // Clear previous OTPs of the same type for this email
        otpCodeRepository.deleteByEmailAndType(email, type);

        // Generate 6-digit OTP
        String otp = String.format("%06d", secureRandom.nextInt(1000000));

        // Save to DB
        OtpCode otpCode = OtpCode.builder()
                .email(email)
                .otpCode(otp)
                .type(type)
                .expirationTime(LocalDateTime.now().plusMinutes(otpExpirationMinutes))
                .build();

        otpCodeRepository.save(otpCode);

        // Send email
        emailService.sendOtpEmail(email, otp);
    }

    @Override
    @Transactional
    public boolean verifyOtp(String email, String otp, OtpType type) {
        Optional<OtpCode> otpCodeOpt = otpCodeRepository.findByEmailAndOtpCodeAndType(email, otp, type);

        if (otpCodeOpt.isEmpty()) {
            return false;
        }

        OtpCode otpCode = otpCodeOpt.get();

        if (otpCode.getExpirationTime().isBefore(LocalDateTime.now())) {
            otpCodeRepository.delete(otpCode);
            return false;
        }

        // OTP is valid, delete it so it can't be reused
        otpCodeRepository.delete(otpCode);
        return true;
    }
}
