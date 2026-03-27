package com.zola.controllers;

import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.chatbox.ChatBoxResponse;
import com.zola.dto.response.chatbox.ChatBoxResponseType;
import com.zola.services.chatbox.ChatBoxService;
import com.zola.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chatbox")
@RequiredArgsConstructor
public class ChatBoxController {

    private final ChatBoxService chatBoxService;

    @PostMapping("/chat")
    public ApiResponse<ChatBoxResponse> chat(@RequestParam String message) {
        String userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.<ChatBoxResponse>builder()
                .result(chatBoxService.chat(message, userId))
                .build();
    }

    @PostMapping("/determine-intent")
    public ApiResponse<ChatBoxResponseType> determineIntent(@RequestParam String message) {
        return ApiResponse.<ChatBoxResponseType>builder()
                .result(chatBoxService.determineIntent(message))
                .build();
    }
}
