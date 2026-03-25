package com.zola.services.chat;

import com.zola.dto.request.chat.AttachmentRequest;
import com.zola.dto.response.chat.ChatMessageResponse;
import com.zola.dto.response.chat.ChatRoomResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ChatService {
    List<ChatRoomResponse> getRooms();
    List<ChatMessageResponse> getMessages(String roomId);
    ChatMessageResponse sendMessage(String roomId, String content, List<AttachmentRequest> attachments);
    ChatRoomResponse getOrCreateRoom(String shopId);
    ChatRoomResponse joinAdminRoom();
    void markAsRead(String roomId, String userId);
    String uploadMedia(MultipartFile file) throws IOException;
}
