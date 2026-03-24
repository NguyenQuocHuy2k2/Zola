package com.zola.dto.response.chat;

import com.zola.enums.AttachmentType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessageAttachmentResponse {
    String id;
    String url;
    AttachmentType type;
    String thumbnailUrl;
}
