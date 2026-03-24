package com.zola.converters;

import com.zola.dto.response.chat.ChatMessageAttachmentResponse;
import com.zola.dto.response.chat.ChatMessageResponse;
import com.zola.dto.response.chat.ChatRoomResponse;
import com.zola.entity.ChatMessage;
import com.zola.entity.ChatMessageAttachment;
import com.zola.entity.ChatRoom;
import com.zola.entity.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ChatConverter {

    public ChatRoomResponse toChatRoomResponse(ChatRoom room, User otherUser, ChatMessage lastMessage, long unreadCount) {
        return ChatRoomResponse.builder()
                .id(room.getId())
                .otherUserId(otherUser != null ? otherUser.getId() : "unknown")
                .otherUserName(otherUser != null ? otherUser.getFirstName() + " " + otherUser.getLastName() : "User")
                .otherUserAvatar(otherUser != null ? otherUser.getAvatarUrl() : null)
                .otherUserEmail(otherUser != null ? otherUser.getEmail() : null)
                .otherUserPhone(otherUser != null ? otherUser.getPhone() : null)
                .lastMessage(lastMessage != null ? lastMessage.getContent() : null)
                .lastMessageTime(lastMessage != null ? lastMessage.getTimestamp() : (room.getCreatedAt() != null ? room.getCreatedAt() : java.time.LocalDateTime.now()))
                .unreadCount(unreadCount)
                .build();
    }

    public ChatMessageResponse toChatMessageResponse(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSenderId())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .isRead(message.getIsRead())
                .attachments(message.getAttachments() != null ? message.getAttachments().stream()
                        .map(this::toAttachmentResponse)
                        .collect(Collectors.toList()) : java.util.Collections.emptyList())
                .build();
    }

    public ChatMessageAttachmentResponse toAttachmentResponse(ChatMessageAttachment attachment) {
        return ChatMessageAttachmentResponse.builder()
                .id(attachment.getId())
                .url(attachment.getUrl())
                .type(attachment.getType())
                .thumbnailUrl(attachment.getThumbnailUrl())
                .build();
    }
}
