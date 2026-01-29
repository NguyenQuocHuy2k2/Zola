package com.zola.dto.request.profile;

import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateProfileRequest {
    String firstName;
    String lastName;

    @Pattern(regexp = "^\\+?[0-9]{10,13}$", message = "Phone must be valid format")
    String phone;

    String avatarUrl;
}
