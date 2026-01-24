package com.zola.services.authentication;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import com.zola.dto.request.auth.IntrospectRequest;
import com.zola.dto.request.auth.RegisterRequest;
import com.zola.dto.response.IntrospectResponse;
import com.zola.entity.User;
import com.zola.enums.OtpType;
import com.zola.enums.PredefinedRole;
import com.zola.exception.AppException;
import com.zola.exception.ErrorCode;
import com.zola.repository.InvalidatedTokenRepository;
import com.zola.repository.RoleRepository;
import com.zola.repository.UserRepository;
import com.zola.services.otp.OtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {

    UserRepository userRepository;
    RoleRepository roleRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    OtpService otpService;
    PasswordEncoder passwordEncoder;

    @Value("${jwt.accessSignerKey:defaultSecretKeyForJwtWhichMustBeAtLeast32BytesLong12345678}")
    @lombok.experimental.NonFinal
    String ACCESS_SIGNER_KEY;

    @Value("${jwt.refreshSignerKey:defaultRefreshKeyForJwtWhichMustBeAtLeast32BytesLong12345678}")
    @lombok.experimental.NonFinal
    String REFRESH_SIGNER_KEY;

    @Override
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername()) || userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .avatarUrl("https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg")
                .isActive(false)
                .role(roleRepository.findByRoleName(PredefinedRole.USER))
                .build();

        userRepository.save(user);
        otpService.sendOtp(request.getEmail(), OtpType.REGISTER);
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) {
        boolean isValid = true;
        try {
            verifyToken(request.getToken(), false);
        } catch (AppException e) {
            isValid = false;
        }
        return IntrospectResponse.builder().valid(isValid).build();
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) {
        try {
            JWSVerifier verifier = new MACVerifier((isRefresh ? REFRESH_SIGNER_KEY : ACCESS_SIGNER_KEY).getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);

            boolean verified = signedJWT.verify(verifier);
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

            if (!(verified && expiryTime.after(new Date()))) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            return signedJWT;
        } catch (JOSEException | ParseException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }
}
