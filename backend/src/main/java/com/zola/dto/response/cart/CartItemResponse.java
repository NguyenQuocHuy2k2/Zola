package com.zola.dto.response.cart;

import com.zola.dto.response.product.ProductResponse;
import com.zola.dto.response.product.ProductVariantResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    String id;
    ProductResponse product;
    ProductVariantResponse variant;
    Integer quantity;
}
