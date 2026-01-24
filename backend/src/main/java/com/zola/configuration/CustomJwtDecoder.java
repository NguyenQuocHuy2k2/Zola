package com.zola.configuration;

import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.zola.dto.request.auth.IntrospectRequest;
import com.zola.exception.AppException;
import com.zola.services.authentication.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.time.Instant;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomJwtDecoder implements JwtDecoder {

    @Lazy
    AuthenticationService authenticationService;

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            var response = authenticationService.introspect(
                    IntrospectRequest.builder().token(token).build());

            if (!response.isValid()) {
                throw new JwtException("Token invalid");
            }
        } catch (AppException e) {
            throw new JwtException(e.getMessage());
        }

        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            return Jwt.withTokenValue(token)
                    .header("alg", "HS512")
                    .subject(claims.getSubject())
                    .issuedAt(claims.getIssueTime() != null ? claims.getIssueTime().toInstant() : Instant.now())
                    .expiresAt(claims.getExpirationTime() != null ? claims.getExpirationTime().toInstant() : Instant.now().plusSeconds(3600))
                    .claim("scope", claims.getStringClaim("scope"))
                    .build();
        } catch (ParseException e) {
            throw new JwtException("Failed to parse token: " + e.getMessage());
        }
    }
}
