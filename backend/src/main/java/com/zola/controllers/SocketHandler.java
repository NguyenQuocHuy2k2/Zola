package com.zola.controllers;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SocketHandler {
    SocketIOServer server;
    com.zola.services.authentication.JwtService jwtService;
    com.zola.services.redis.RedisService redisService;

    @OnConnect
    public void clientConnected(SocketIOClient client) {
        String token = client.getHandshakeData().getSingleUrlParam("token");
        try {
            var signedJWT = jwtService.verifyToken(token, false);
            String userId = signedJWT.getJWTClaimsSet().getSubject();
            client.set("userId", userId);
            
            // Lưu trạng thái online vào Redis
            redisService.set("user:session:" + userId, client.getSessionId().toString(), 1, java.util.concurrent.TimeUnit.DAYS);
            
            log.info("Client connected: {} (UserId: {})", client.getSessionId(), userId);
        } catch (Exception e) {
            log.error("Authentication failed for client: {}", client.getSessionId());
            client.disconnect();
        }
    }

    @OnDisconnect
    public void clientDisconnected(SocketIOClient client) {
        String userId = client.get("userId");
        if (userId != null) {
            String currentSessionId = redisService.get("user:session:" + userId);
            if (client.getSessionId().toString().equals(currentSessionId)) {
                redisService.delete("user:session:" + userId);
                log.info("Client disconnected and session cleared: {} (UserId: {})", client.getSessionId(), userId);
            } else {
                log.info("Client disconnected but session not cleared (newer session exists): {} (UserId: {})", client.getSessionId(), userId);
            }
        } else {
            log.info("Client disconnected: {}", client.getSessionId());
        }
    }

    @OnEvent("join_room")
    public void onJoinRoom(SocketIOClient client, String roomId) {
        client.joinRoom(roomId);
        log.info("Client {} joined room: {}", client.getSessionId(), roomId);
    }

    @OnEvent("leave_room")
    public void onLeaveRoom(SocketIOClient client, String roomId) {
        client.leaveRoom(roomId);
        log.info("Client {} left room: {}", client.getSessionId(), roomId);
    }

    @PostConstruct
    public void startServer() {
        server.start();
        server.addListeners(this);
    }

    @PreDestroy
    public void stopServer() {
        server.stop();
        log.info("Socket server stoped");
    }
}
