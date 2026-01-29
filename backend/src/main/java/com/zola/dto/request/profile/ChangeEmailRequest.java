package com.zola.dto.request.profile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeEmailRequest {

    @NotBlank(message = "New email is required")
    @Email(message = "Email must be a valid format")
    String newEmail;

    @NotBlank(message = "OTP code is required")
    @Size(min = 6, max = 6, message = "OTP must be 6 characters")
    String otpCode;

    @NotBlank(message = "Current password is required")
    String currentPassword;
}
