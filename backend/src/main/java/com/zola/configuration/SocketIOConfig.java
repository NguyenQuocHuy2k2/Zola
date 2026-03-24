package com.zola.configuration;

import com.corundumstudio.socketio.AuthorizationResult;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.protocol.JacksonJsonSupport;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.zola.services.authentication.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class SocketIOConfig {

    private final JwtService jwtService;

    @Value("${socket-server.host}")
    private String host;

    @Value("${socket-server.port}")
    private int port;

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration configuration = new com.corundumstudio.socketio.Configuration();
        configuration.setHostname(host);
        configuration.setPort(port);

        // Register JavaTimeModule to handle LocalDateTime with Socket.IO Server
        JacksonJsonSupport jsonSupport = new JacksonJsonSupport(new JavaTimeModule());
        configuration.setJsonSupport(jsonSupport);

        // Important: Allow React Native (Emulator/Real device) connection
        configuration.setAllowCustomRequests(true);

        // JWT Authentication Handshake
        configuration.setAuthorizationListener(authHandshake -> {
            String token = authHandshake.getSingleUrlParam("token");
            try {
                jwtService.verifyToken(token, false);
                return AuthorizationResult.SUCCESSFUL_AUTHORIZATION;
            } catch (Exception e) {
                return AuthorizationResult.FAILED_AUTHORIZATION;
            }
        });

        return new SocketIOServer(configuration);
    }
}
