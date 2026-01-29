package com.zola.dto.request.profile;

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
public class ChangePhoneRequest {

    @NotBlank(message = "New phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,13}$", message = "Phone must be valid format")
    String newPhone;

    @NotBlank(message = "OTP code is required")
    @Size(min = 6, max = 6, message = "OTP must be 6 characters")
    String otpCode;
}
