package com.zola.services.chat;

import com.corundumstudio.socketio.SocketIOServer;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SocketServiceImpl implements SocketService {
    SocketIOServer server;

    @Override
    public void sendToUser(String userId, String event, Object data) {
        // Broadcast to all sessions of this user using their private room
        server.getRoomOperations("user_" + userId).sendEvent(event, data);
        log.info("Sent event '{}' to all sessions of user: {}", event, userId);
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
