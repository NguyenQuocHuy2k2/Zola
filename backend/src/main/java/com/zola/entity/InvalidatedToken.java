package com.zola.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "invalidated_tokens")
public class InvalidatedToken {

    @Id
    @Column(name = "access_id")
    String accessId;

    @Column(name = "refresh_id")
    String refreshId;

    @Column(name = "expiration_time")
    LocalDateTime expirationTime;
}
