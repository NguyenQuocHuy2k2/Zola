package com.zola.controllers;

import com.zola.dto.request.chat.ChatMessageRequest;
import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.chat.ChatMessageResponse;
import com.zola.dto.response.chat.ChatRoomResponse;
import com.zola.services.chat.ChatService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("chat")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {

    ChatService chatService;

    @GetMapping("/rooms")
    public ApiResponse<List<ChatRoomResponse>> getRooms() {
        return ApiResponse.<List<ChatRoomResponse>>builder()
                .result(chatService.getRooms())
                .build();
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ApiResponse<List<ChatMessageResponse>> getMessages(@PathVariable String roomId) {
        return ApiResponse.<List<ChatMessageResponse>>builder()
                .result(chatService.getMessages(roomId))
                .build();
    }

    @PostMapping("/rooms/{roomId}/send")
    public ApiResponse<ChatMessageResponse> sendMessage(
            @PathVariable String roomId,
            @RequestBody ChatMessageRequest request) {
        
        return ApiResponse.<ChatMessageResponse>builder()
                .result(chatService.sendMessage(roomId, request.getContent(), request.getAttachments()))
                .build();
    }

    @GetMapping("/rooms/join")
    public ApiResponse<ChatRoomResponse> joinRoom(@RequestParam String shopId) {
        return ApiResponse.<ChatRoomResponse>builder()
                .result(chatService.getOrCreateRoom(shopId))
                .build();
    }

    @GetMapping("/rooms/admin")
    public ApiResponse<ChatRoomResponse> joinAdminRoom() {
        return ApiResponse.<ChatRoomResponse>builder()
                .result(chatService.joinAdminRoom())
                .build();
    }

    @PostMapping("/upload-media")
    public ApiResponse<String> uploadMedia(@RequestParam("file") MultipartFile file) throws IOException {
        return ApiResponse.<String>builder()
                .result(chatService.uploadMedia(file))
                .build();
    }
}
