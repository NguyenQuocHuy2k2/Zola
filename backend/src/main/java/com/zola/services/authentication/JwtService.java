package com.zola.services.authentication;

import com.nimbusds.jwt.SignedJWT;
import com.zola.entity.User;

public interface JwtService {
    String generateAccessToken(User user, String rfId);
    String generateRefreshToken(User user, String acId);
    SignedJWT verifyToken(String token, boolean isRefresh);
}
