package com.zola.dto.response.chatbox;

import com.zola.enums.ChatIntent;

import java.time.LocalDateTime;

public record ChatBoxResponse(
        ChatIntent intent,      // Loại phản hồi (QA, Product,...)
        String message,         // Nội dung text AI trả về (hoặc câu chào)
        Object data            // Dữ liệu đính kèm (List<ProductDTO>, OrderInfo,...)
) {
}
