package com.zola.services.chat;

public interface SocketService {
    // Sends a message to a specific user based on userId.
    void sendToUser(String userId, String event, Object data);

    // Broadcasts a message to all connected clients.
    void broadcast(String event, Object data);

    // Sends a message to a specific room.
    void sendToRoom(String room, String event, Object data);
}
