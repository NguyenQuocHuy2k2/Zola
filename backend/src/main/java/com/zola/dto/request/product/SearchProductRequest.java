package com.zola.dto.request.product;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchProductRequest {
    String keyword;
    Integer categoryId;
    BigDecimal minPrice;
    BigDecimal maxPrice;
    Integer colorId;
    Integer sizeId;
    @Builder.Default
    int page = 0;
    @Builder.Default
    int size = 10;
}
