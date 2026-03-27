package com.zola.controllers;

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
    public ChatBoxResponse chat(@RequestParam String message) {
        String userId = SecurityUtils.getCurrentUserId();
        return chatBoxService.chat(message, userId);
    }

    @PostMapping("/determine-intent")
    public ChatBoxResponseType determineIntent(@RequestParam String message) {
        return chatBoxService.determineIntent(message);
    }
}
