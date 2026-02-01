package com.zola.dto.response.product;

import com.zola.dto.response.category.CategoryResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    String id;
    String name;
    String description;
    BigDecimal basePrice;
    String status;
    String brand;
    CategoryResponse category;
    List<ProductImageResponse> images;
    List<ProductVariantResponse> variants;
    Long favoriteCount;
}
