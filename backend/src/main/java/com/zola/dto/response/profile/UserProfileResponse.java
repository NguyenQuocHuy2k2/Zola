package com.zola.dto.response.profile;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileResponse {
    String id;
    String username;
    String firstName;
    String lastName;
    String email;
    String phone;
    String avatarUrl;
    String role;
    LocalDateTime createdAt;
}
