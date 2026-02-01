package com.zola.services.authentication;

import com.zola.dto.request.auth.*;
import com.zola.dto.request.auth.password.ResetPasswordRequest;
import com.zola.dto.response.auth.AuthResponse;
import com.zola.dto.response.auth.IntrospectResponse;

public interface AuthenticationService {
    void register(RegisterRequest request);

    AuthResponse verifyRegister(String email, String otp);

    AuthResponse authenticate(LoginRequest request);

    void logout(LogoutRequest request);

    AuthResponse refresh(RefreshTokenRequest request);

    IntrospectResponse introspect(IntrospectRequest request);

    void resetPassword(ResetPasswordRequest request);

    String initForgotPassword(String identifier);
    
    String verifyForgotPasswordOtp(String identifier, String otp);
}
