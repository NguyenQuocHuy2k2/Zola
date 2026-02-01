package com.zola.dto.response.search;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchHistoryResponse {
    Long id;
    String keyword;
    LocalDateTime createdAt;
}
