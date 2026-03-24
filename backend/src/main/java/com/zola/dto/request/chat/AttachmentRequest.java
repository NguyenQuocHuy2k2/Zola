package com.zola.dto.request.chat;

import com.zola.enums.AttachmentType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttachmentRequest {
    String url;
    AttachmentType type;
    String thumbnailUrl;
}
