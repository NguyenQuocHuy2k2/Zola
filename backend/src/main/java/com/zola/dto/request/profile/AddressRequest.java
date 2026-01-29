package com.zola.dto.request.profile;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressRequest {

    @NotBlank(message = "Province is required")
    String province;

    @NotBlank(message = "District is required")
    String district;

    @NotBlank(message = "Ward is required")
    String ward;

    String streetAddress;

    @Builder.Default
    Boolean isDefault = false;
}
