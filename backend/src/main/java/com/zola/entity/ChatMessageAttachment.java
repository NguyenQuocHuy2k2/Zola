package com.zola.entity;

import com.zola.enums.AttachmentType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "chat_message_attachments")
public class ChatMessageAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    ChatMessage message;

    @Column(name = "url", nullable = false, columnDefinition = "TEXT")
    String url;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    AttachmentType type;

    @Column(name = "thumbnail_url", columnDefinition = "TEXT")
    String thumbnailUrl;
}
