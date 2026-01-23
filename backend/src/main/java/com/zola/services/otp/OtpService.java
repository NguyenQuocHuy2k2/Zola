package com.zola.services.otp;

import com.zola.enums.OtpType;

public interface OtpService {
    void sendOtp(String email, OtpType type);

    boolean verifyOtp(String email, String otp, OtpType type);
}
