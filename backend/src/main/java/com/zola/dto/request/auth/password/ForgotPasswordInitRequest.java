package com.zola.dto.request.auth.password;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ForgotPasswordInitRequest {

    @NotBlank(message = "Identifier is required")
    String identifier; // username, phone, or email
}
