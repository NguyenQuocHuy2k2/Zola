package com.zola.converters;

import com.zola.dto.response.attribute.ColorResponse;
import com.zola.dto.response.attribute.SizeResponse;
import com.zola.dto.response.category.CategoryResponse;
import com.zola.dto.response.product.ProductImageResponse;
import com.zola.dto.response.product.ProductResponse;
import com.zola.dto.response.product.ProductVariantResponse;
import com.zola.entity.Product;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductConverter {

    public ProductResponse toProductResponse(Product product) {
        if (product == null) {
            return null;
        }

        CategoryResponse categoryResponse = null;
        if (product.getCategory() != null) {
            categoryResponse = CategoryResponse.builder()
                    .id(product.getCategory().getId())
                    .name(product.getCategory().getName())
                    .description(product.getCategory().getDescription())
                    .imageUrl(product.getCategory().getImageUrl())
                    .build();
        }

        List<ProductImageResponse> imageResponses = product.getImages() != null ? product.getImages().stream().map(img ->
                ProductImageResponse.builder()
                        .id(img.getId())
                        .imageUrl(img.getImageUrl())
                        .isPrimary(img.getIsPrimary())
                        .build()
        ).collect(Collectors.toList()) : null;

        List<ProductVariantResponse> variantResponses = product.getVariants() != null ? product.getVariants().stream().map(v -> {
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
        }).collect(Collectors.toList()) : null;

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .basePrice(product.getBasePrice())
                .status(product.getStatus().name())
                .brand(product.getBrand())
                .category(categoryResponse)
                .images(imageResponses)
                .variants(variantResponses)
                .favoriteCount(product.getFavoriteCount())
                .build();
    }
}
