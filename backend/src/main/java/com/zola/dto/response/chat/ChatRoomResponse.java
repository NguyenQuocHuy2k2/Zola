package com.zola.dto.response.chat;

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
    LocalDateTime lastMessageTime;
    long unreadCount;
}
