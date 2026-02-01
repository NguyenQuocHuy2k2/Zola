package com.zola.services.authentication;

import com.zola.dto.request.auth.*;
import com.zola.dto.request.auth.password.ResetPasswordRequest;
import com.zola.dto.response.auth.AuthResponse;
import com.zola.dto.response.auth.IntrospectResponse;
import com.zola.entity.InvalidatedToken;
import com.zola.entity.User;
import com.zola.enums.OtpType;
import com.zola.enums.PredefinedRole;
import com.zola.exception.AppException;
import com.zola.exception.ErrorCode;
import com.zola.mapper.UserMapper;
import com.zola.repository.InvalidatedTokenRepository;
import com.zola.repository.RoleRepository;
import com.zola.repository.UserRepository;
import com.zola.services.otp.OtpService;
import org.springframework.data.redis.core.StringRedisTemplate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {

    UserRepository userRepository;
    RoleRepository roleRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    OtpService otpService;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    StringRedisTemplate redisTemplate;
    JwtService jwtService;

    @NonFinal
    @Value("${app.default-avatar-url}")
    String DEFAULT_AVATAR_URL;

    @Override
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED); // Or EMAIL_EXISTED if added to ErrorCode
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .avatarUrl(DEFAULT_AVATAR_URL)
                .isActive(false)
                .role(roleRepository.findByRoleName(PredefinedRole.USER))
                .build();

        userRepository.save(user);
        otpService.sendOtp(request.getEmail(), OtpType.REGISTER);
    }

    @Override
    @Transactional
    public AuthResponse verifyRegister(String email, String otp) {
        if (!otpService.verifyOtp(email, otp, OtpType.REGISTER)) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setIsActive(true);
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    // login with username, email, or phone
    @Override
    public AuthResponse authenticate(LoginRequest request) {
        User user = userRepository.findByUsername(request.getIdentifier())
            .or(() -> userRepository.findByEmail(request.getIdentifier()))
            .or(() -> userRepository.findByPhone(request.getIdentifier()))
            .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_MISMATCH);
        }

        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_NOT_ACTIVE);
        }

        return buildAuthResponse(user);
    }

    @Override
    public void logout(LogoutRequest request) {
        try {
            var signedJWT = jwtService.verifyToken(request.getToken(), false);
            String jit = signedJWT.getJWTClaimsSet().getJWTID();
            String rfId = signedJWT.getJWTClaimsSet().getStringClaim("rfId");
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .accessId(jit)
                    .refreshId(rfId)
                    .expirationTime(expiryTime.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime())
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException | java.text.ParseException e) {
            // Already logged out or invalid token
        }
    }

    @Override
    public AuthResponse refresh(RefreshTokenRequest request) {
        try {
            var signedJWT = jwtService.verifyToken(request.getRefreshToken(), true);
            String jit = signedJWT.getJWTClaimsSet().getJWTID();
            String acId = signedJWT.getJWTClaimsSet().getStringClaim("acId");
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

            // Blacklist the old refresh token
            invalidatedTokenRepository.save(InvalidatedToken.builder()
                    .accessId(acId)
                    .refreshId(jit)
                    .expirationTime(expiryTime.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime())
                    .build());

            String userId = signedJWT.getJWTClaimsSet().getSubject();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

            return buildAuthResponse(user);
        } catch (AppException | java.text.ParseException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) {
        boolean isValid = true;
        try {
            jwtService.verifyToken(request.getToken(), false);
        } catch (AppException e) {
            isValid = false;
        }
        return IntrospectResponse.builder().valid(isValid).build();
    }

    @Override
    public String initForgotPassword(String identifier) {
        User user = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByPhone(identifier))
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        otpService.sendOtp(user.getEmail(), OtpType.RESET_PASSWORD);
        return maskEmail(user.getEmail());
    }

    private User findUserByIdentifier(String identifier) {
        return userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByPhone(identifier))
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public String verifyForgotPasswordOtp(String identifier, String otp) {
        User user = findUserByIdentifier(identifier);
        String attemptsKey = "forgot-password:attempts:" + identifier;
        
        // Rate limiting
        String attemptsStr = redisTemplate.opsForValue().get(attemptsKey);
        int attempts = attemptsStr == null ? 0 : Integer.parseInt(attemptsStr);
        if (attempts >= 5) {
            throw new AppException(ErrorCode.TOO_MANY_REQUESTS);
        }

        // If OTP is invalid, increment attempts and set expiration
        if (!otpService.verifyOtp(user.getEmail(), otp, OtpType.RESET_PASSWORD)) {
            redisTemplate.opsForValue().increment(attemptsKey);
            redisTemplate.expire(attemptsKey, 15, java.util.concurrent.TimeUnit.MINUTES);
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        // Success - Clear attempts and generate reset token
        redisTemplate.delete(attemptsKey);
        String resetToken = UUID.randomUUID().toString();
        String tokenKey = "forgot-password:token:" + resetToken;
        redisTemplate.opsForValue().set(tokenKey, identifier, 5, java.util.concurrent.TimeUnit.MINUTES);
        
        return resetToken;
    }

    private String maskEmail(String email) {
        int atIndex = email.indexOf('@');
        if (atIndex <= 1) return email;
        return email.charAt(0) + "***" + email.substring(atIndex);
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        String tokenKey = "forgot-password:token:" + request.getResetToken();
        String identifier = redisTemplate.opsForValue().get(tokenKey);
        
        if (identifier == null || !identifier.equals(request.getIdentifier())) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        User user = findUserByIdentifier(identifier);

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        // Consume token
        redisTemplate.delete(tokenKey);
    }

    private AuthResponse buildAuthResponse(User user) {
        String acId = UUID.randomUUID().toString();
        String rfId = UUID.randomUUID().toString();

        String accessToken = jwtService.generateAccessToken(user, rfId);
        String refreshToken = jwtService.generateRefreshToken(user, acId);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userMapper.toUserProfileResponse(user))
                .build();
    }
}
