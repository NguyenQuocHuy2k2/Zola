package com.zola.converters;

import com.zola.dto.response.attribute.ColorResponse;
import com.zola.dto.response.attribute.SizeResponse;
import com.zola.dto.response.cart.CartItemResponse;
import com.zola.dto.response.product.ProductVariantResponse;
import com.zola.entity.CartItem;
import com.zola.entity.ProductVariant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CartConverter {
    private final ProductConverter productConverter;

    public CartItemResponse toCartItemResponse(CartItem cartItem) {
        if (cartItem == null) {
            return null;
        }

        return CartItemResponse.builder()
                .id(cartItem.getId())
                .product(productConverter.toProductResponse(cartItem.getProductVariant().getProduct()))
                .variant(toProductVariantResponse(cartItem.getProductVariant()))
                .quantity(cartItem.getQuantity())
                .build();
    }

    private ProductVariantResponse toProductVariantResponse(ProductVariant v) {
        if (v == null) return null;

        SizeResponse sizeResp = v.getSize() != null ? SizeResponse.builder()
                .id(v.getSize().getId())
                .name(v.getSize().getName())
                .build() : null;

        ColorResponse colorResp = v.getColor() != null ? ColorResponse.builder()
                .id(v.getColor().getId())
                .name(v.getColor().getName())
                .hexCode(v.getColor().getHexCode())
                .build() : null;

        return ProductVariantResponse.builder()
                .id(v.getId())
                .size(sizeResp)
                .color(colorResp)
                .stockQuantity(v.getStockQuantity())
                .build();
    }
}
