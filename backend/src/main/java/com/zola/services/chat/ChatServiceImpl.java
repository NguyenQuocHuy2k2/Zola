package com.zola.services.chat;

import com.zola.converters.ChatConverter;
import com.zola.dto.request.chat.AttachmentRequest;
import com.zola.dto.response.chat.ChatMessageResponse;
import com.zola.dto.response.chat.ChatRoomResponse;
import com.zola.entity.ChatMessage;
import com.zola.entity.ChatMessageAttachment;
import com.zola.entity.ChatRoom;
import com.zola.entity.User;
import com.zola.repository.ChatMessageAttachmentRepository;
import com.zola.repository.ChatMessageRepository;
import com.zola.repository.ChatRoomRepository;
import com.zola.repository.UserRepository;
import com.zola.services.cloudinary.CloudinaryService;
import com.zola.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatMessageAttachmentRepository chatMessageAttachmentRepository;
    private final UserRepository userRepository;
    private final ChatConverter chatConverter;
    private final CloudinaryService cloudinaryService;
    private final SocketService socketService;

    @Override
    public List<ChatRoomResponse> getRooms() {
        String currentUserId = SecurityUtils.getCurrentUserId();
        boolean isAdmin = SecurityUtils.isAdmin();
        
        List<ChatRoom> rooms;
        if (isAdmin) {
            rooms = chatRoomRepository.findAllByShopIdOrderByCreatedAtDesc(currentUserId);
        } else {
            rooms = chatRoomRepository.findAllByUserIdOrderByCreatedAtDesc(currentUserId);
        }

        return rooms.stream().map(room -> {
            String otherUserId = isAdmin ? room.getUserId() : room.getShopId();
            User otherUser = userRepository.findById(otherUserId).orElse(null);
            ChatMessage lastMessage = chatMessageRepository.findFirstByRoomIdOrderByTimestampDesc(room.getId()).orElse(null);
            long unreadCount = chatMessageRepository.countByRoomIdAndIsReadFalseAndSenderIdNot(room.getId(), currentUserId);
            
            return chatConverter.toChatRoomResponse(room, otherUser, lastMessage, unreadCount);
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ChatMessageResponse> getMessages(String roomId) {
        String currentUserId = SecurityUtils.getCurrentUserId();
        List<ChatMessage> messages = chatMessageRepository.findAllByRoomIdOrderByTimestampAsc(roomId);
        
        // Mark as read and notify
        markAsRead(roomId, currentUserId);
        
        return messages.stream()
                .map(chatConverter::toChatMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ChatMessageResponse sendMessage(String roomId, String content, List<AttachmentRequest> attachments) {
        String senderId = SecurityUtils.getCurrentUserId();
        ChatMessage message = ChatMessage.builder()
                .roomId(roomId)
                .senderId(senderId)
                .content(content)
                .isRead(false)
                .timestamp(LocalDateTime.now())
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(message);

        if (attachments != null && !attachments.isEmpty()) {
            List<ChatMessageAttachment> attachmentEntities = attachments.stream()
                    .map(req -> ChatMessageAttachment.builder()
                            .message(savedMessage)
                            .url(req.getUrl())
                            .type(req.getType())
                            .thumbnailUrl(req.getThumbnailUrl())
                            .build())
                    .collect(Collectors.toList());
            chatMessageAttachmentRepository.saveAll(attachmentEntities);
            savedMessage.setAttachments(attachmentEntities);
        }

        ChatMessageResponse response = chatConverter.toChatMessageResponse(savedMessage);
        
        // Broadcast message to room
        socketService.sendToRoom(roomId, "receive_message", response);
 
        // Notify recipient about room update (last message, unread count)
        ChatRoom room = chatRoomRepository.findById(roomId).orElse(null);
        if (room != null) {
            String recipientId = senderId.equals(room.getUserId()) ? room.getShopId() : room.getUserId();
            User otherUser = userRepository.findById(senderId).orElse(null); // Sender is the 'otherUser' for the recipient
            long unreadCount = chatMessageRepository.countByRoomIdAndIsReadFalseAndSenderIdNot(room.getId(), recipientId);
            ChatRoomResponse roomResponse = chatConverter.toChatRoomResponse(room, otherUser, savedMessage, unreadCount);
            socketService.sendToUser(recipientId, "update_chat_list", roomResponse);
        }
 
        return response;
    }

    @Override
    public ChatRoomResponse getOrCreateRoom(String shopId) {
        String userId = SecurityUtils.getCurrentUserId();
        ChatRoom room = chatRoomRepository.findByShopIdAndUserId(shopId, userId)
                .orElseGet(() -> chatRoomRepository.save(ChatRoom.builder()
                        .shopId(shopId)
                        .userId(userId)
                        .createdAt(LocalDateTime.now())
                        .build()));

        User shopUser = userRepository.findById(shopId).orElse(null);
        ChatMessage lastMessage = chatMessageRepository.findFirstByRoomIdOrderByTimestampDesc(room.getId()).orElse(null);
        long unreadCount = chatMessageRepository.countByRoomIdAndIsReadFalseAndSenderIdNot(room.getId(), userId);

        return chatConverter.toChatRoomResponse(room, shopUser, lastMessage, unreadCount);
    }

    @Override
    public ChatRoomResponse joinAdminRoom() {
        // Find the first admin in the system
        List<User> admins = userRepository.findAllByRole_Name("ADMIN");
        if (admins.isEmpty()) {
            throw new RuntimeException("No admin found in the system");
        }
        
        String adminId = admins.get(0).getId();
        return getOrCreateRoom(adminId);
    }

    @Override
    @Transactional
    public void markAsRead(String roomId, String currentUserId) {
        List<ChatMessage> messages = chatMessageRepository.findAllByRoomIdOrderByTimestampAsc(roomId);
        if (messages.isEmpty()) return;

        boolean updated = false;
        for (ChatMessage m : messages) {
            if (!m.getSenderId().equals(currentUserId) && !m.getIsRead()) {
                m.setIsRead(true);
                chatMessageRepository.save(m);
                updated = true;
            }
        }

        if (updated) {
            socketService.sendToRoom(roomId, "messages_read", java.util.Map.of(
                    "roomId", roomId,
                    "viewerId", currentUserId
            ));
        }

        // Always send update_chat_list to ensure receiver's list is current
        ChatRoom room = chatRoomRepository.findById(roomId).orElse(null);
        if (room != null) {
            boolean isAdmin = userRepository.findById(currentUserId)
                .map(u -> u.getRole().getName().equals("ADMIN"))
                .orElse(false);
            
            String otherUserId = isAdmin ? room.getUserId() : room.getShopId();
            User otherUser = userRepository.findById(otherUserId).orElse(null);
            ChatMessage lastMessage = messages.get(messages.size() - 1);
            ChatRoomResponse roomResponse = chatConverter.toChatRoomResponse(room, otherUser, lastMessage, 0);
            socketService.sendToUser(currentUserId, "update_chat_list", roomResponse);
        }
    }

    @Override
    public String uploadMedia(MultipartFile file) throws IOException {
        return cloudinaryService.uploadImage(file, "zola/chat");
    }
}
