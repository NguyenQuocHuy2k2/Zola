package com.zola.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "chat_rooms")
@EntityListeners(AuditingEntityListener.class)
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "shop_id", nullable = false)
    String shopId;

    @Column(name = "user_id", nullable = false)
    String userId;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;
}
