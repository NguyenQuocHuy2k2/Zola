package com.zola.dto.request.auth;

import com.zola.enums.PredefinedRole;
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
public class UserCreationRequest {
    @Size(min = 4, max = 20, message = "username must be between 4 and 20 characters")
    String username;

    @Size(min = 8, message = "password must be at least 8 characters long")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*(){}\\[\\]!~`|])(?=.*\\d).*$",
            message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    )
    String password;

    @Size(min = 8, message = "password must be at least 8 characters long")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*(){}\\[\\]!~`|])(?=.*\\d).*$",
            message = "Confirm password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    )
    String confirmPassword;

    @Pattern(regexp = "^[\\w.-]+@[\\w.-]+\\.\\w{2,}$", message = "email must be a valid email address")
    String email;

    String firstName;

    String lastName;

    PredefinedRole roleName;
}
