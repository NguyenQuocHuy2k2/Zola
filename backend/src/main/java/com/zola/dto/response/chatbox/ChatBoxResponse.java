package com.zola.dto.response.chatbox;

public record ChatBoxResponse(
            String conversationId, // userID
            String message
) {
}
