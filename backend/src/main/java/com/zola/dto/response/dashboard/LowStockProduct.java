package com.zola.dto.response.dashboard;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LowStockProduct {
    String productId;
    String productName;
    String productVariantId;
    String size;
    String color;
    Integer stockQuantity;
    String imageUrl;
    BigDecimal price;
    String categoryName;
}
