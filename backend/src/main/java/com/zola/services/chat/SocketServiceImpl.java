package com.zola.services.chat;

import com.corundumstudio.socketio.SocketIOServer;
import com.zola.services.redis.RedisService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SocketServiceImpl implements SocketService {
    SocketIOServer server;
    RedisService redisService;

    @Override
    public void sendToUser(String userId, String event, Object data) {
        String sessionIdStr = redisService.get("user:session:" + userId);
        if (sessionIdStr != null) {
            try {
                UUID sessionId = UUID.fromString(sessionIdStr);
                var client = server.getClient(sessionId);
                if (client != null) {
                    client.sendEvent(event, data);
                    log.info("Sent event '{}' to user: {}", event, userId);
                } else {
                    log.warn("Client for user {} (session: {}) not found on this server", userId, sessionId);
                    redisService.delete("user:session:" + userId);
                }
            } catch (Exception e) {
                log.error("Error sending event to user {}: {}", userId, e.getMessage());
            }
        } else {
            log.info("User {} is currently offline", userId);
        }
    }

    @Override
    public void broadcast(String event, Object data) {
        server.getBroadcastOperations().sendEvent(event, data);
        log.info("Broadcasted event '{}' to all clients", event);
    }

    @Override
    public void sendToRoom(String room, String event, Object data) {
        server.getRoomOperations(room).sendEvent(event, data);
        log.info("Sent event '{}' to room: {}", event, room);
    }
}
