package com.zola.dto.request.auth.password;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResetPasswordRequest {

    @NotBlank(message = "Identifier is required")
    String identifier; // username, phone, or email

    @NotBlank(message = "Reset token is required")
    String resetToken;

    @NotBlank(message = "New password cannot be blank")
    @Size(min = 8, message = "password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*(){}\\[\\]!~`|])(?=.*\\d).*$", message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character")
    String newPassword;
}
