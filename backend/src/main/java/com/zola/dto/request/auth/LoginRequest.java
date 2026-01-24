package com.zola.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequest {

    // Can be either username or email or phone
    @NotBlank(message = "Identifier is required")
    String identifier;

    @NotBlank(message = "Password is required")
    String password;
}
