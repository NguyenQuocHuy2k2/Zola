package com.zola.services.chatbox;

import com.zola.dto.response.chatbox.ChatBoxResponse;
import com.zola.dto.response.chatbox.ChatBoxResponseType;

public interface ChatBoxService {
    ChatBoxResponse chat(String message, String userId);
    ChatBoxResponseType determineIntent(String message);
}
