package com.zola.dto.response.address;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressResponse {
    String id;
    String province;
    String district;
    String ward;
    String streetAddress;
    Boolean isDefault;
    LocalDateTime createdAt;
}
