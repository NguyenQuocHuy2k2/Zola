package com.zola.dto.response.order;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {
    String id;
    String orderItemId;
    String productId;
    String productName;
    String imageUrl;
    Integer rating;
    String comment;
    String userFullName;
    String userAvatarUrl;
    LocalDateTime createdAt;
}
