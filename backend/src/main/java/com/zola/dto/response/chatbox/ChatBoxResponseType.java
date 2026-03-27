package com.zola.dto.response.chatbox;

import com.zola.enums.ChatIntent;

public record ChatBoxResponseType(
        ChatIntent intent
) {
}
