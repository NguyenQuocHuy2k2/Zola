package com.zola.services.authentication;

import com.zola.dto.request.auth.IntrospectRequest;
import com.zola.dto.response.IntrospectResponse;

public interface AuthenticationService {
    IntrospectResponse introspect(IntrospectRequest request);
}
