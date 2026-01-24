package com.zola.services.authentication;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.zola.dto.request.auth.IntrospectRequest;
import com.zola.dto.request.auth.RegisterRequest;
import com.zola.dto.response.AuthResponse;
import com.zola.dto.response.IntrospectResponse;
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
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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

    @Value("${jwt.accessSignerKey:defaultSecretKeyForJwtWhichMustBeAtLeast32BytesLong12345678}")
    @NonFinal
    String ACCESS_SIGNER_KEY;

    @Value("${jwt.refreshSignerKey:defaultRefreshKeyForJwtWhichMustBeAtLeast32BytesLong12345678}")
    @NonFinal
    String REFRESH_SIGNER_KEY;

    @Value("${jwt.valid-duration:3600}")
    @NonFinal
    long VALID_DURATION;

    @Value("${jwt.refreshable-duration:86400}")
    @NonFinal
    long REFRESHABLE_DURATION;

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
    @Transactional
    public AuthResponse verifyRegister(String email, String otp) {
        if (!otpService.verifyOtp(email, otp, OtpType.REGISTER)) {
            throw new AppException(ErrorCode.INVALID_KEY);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setIsActive(true);
        userRepository.save(user);

        return buildAuthResponse(user);
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

    private AuthResponse buildAuthResponse(User user) {
        String acId = UUID.randomUUID().toString();
        String rfId = UUID.randomUUID().toString();

        String accessToken = generateToken(user, VALID_DURATION, acId, rfId, ACCESS_SIGNER_KEY);
        String refreshToken = generateToken(user, REFRESHABLE_DURATION, rfId, acId, REFRESH_SIGNER_KEY);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userMapper.toUserProfileResponse(user))
                .build();
    }

    private String generateToken(User user, long duration, String jit, String otherId, String signerKey) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .issuer("zola.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(duration, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(jit)
                .claim(signerKey.equals(ACCESS_SIGNER_KEY) ? "rfId" : "acId", otherId)
                .claim("scope", user.getRole().getName())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
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
