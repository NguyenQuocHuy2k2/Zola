package com.zola.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "chat_messages")
@EntityListeners(AuditingEntityListener.class)
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "room_id", nullable = false)
    String roomId;

    @Column(name = "sender_id", nullable = false)
    String senderId;

    @Column(name = "content", columnDefinition = "TEXT")
    String content;

    @Column(name = "is_read")
    @Builder.Default
    Boolean isRead = false;

    @CreatedDate
    @Column(name = "timestamp", updatable = false)
    LocalDateTime timestamp;

    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<ChatMessageAttachment> attachments;
}
