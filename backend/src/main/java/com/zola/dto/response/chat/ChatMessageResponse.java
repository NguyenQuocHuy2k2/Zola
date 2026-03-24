package com.zola.dto.response.chat;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessageResponse {
    String id;
    String roomId;
    String senderId;
    String content;
    LocalDateTime timestamp;
    Boolean isRead;
    List<ChatMessageAttachmentResponse> attachments;
}
