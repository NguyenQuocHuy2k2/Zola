package com.zola.dto.request.chatbox;

public record ChatBoxRequest(
        String conversationId, // userID
        String message
) {
}
