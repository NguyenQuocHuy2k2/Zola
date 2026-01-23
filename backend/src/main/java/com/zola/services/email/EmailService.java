package com.zola.services.email;

public interface EmailService {
    void sendOtpEmail(String to, String otp);
}
