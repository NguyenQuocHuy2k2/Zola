package com.zola.services.authentication;

import com.zola.dto.request.auth.*;
import com.zola.dto.response.AuthResponse;
import com.zola.dto.response.IntrospectResponse;

public interface AuthenticationService {
    IntrospectResponse introspect(IntrospectRequest request);
    void register(RegisterRequest request);
    AuthResponse verifyRegister(String email, String otp);
    AuthResponse authenticate(LoginRequest request);
    void logout(LogoutRequest request);
    AuthResponse refresh(RefreshTokenRequest request);
    void forgetPassword(ForgetPasswordRequest request);
    String initForgotPassword(String identifier);
}
