package com.zola.dto.response.chat;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatRoomResponse {
    String id;
    String otherUserId;
    String otherUserName;
    String otherUserAvatar;
    String otherUserEmail;
    String otherUserPhone;
    String lastMessage;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    LocalDateTime lastMessageTime;
    long unreadCount;
}
