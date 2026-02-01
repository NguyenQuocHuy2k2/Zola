package com.zola.dto.response.product;

import com.zola.dto.response.attribute.SizeResponse;
import com.zola.dto.response.attribute.ColorResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductVariantResponse {
    Long id;
    SizeResponse size;
    ColorResponse color;
    Integer stockQuantity;
}
