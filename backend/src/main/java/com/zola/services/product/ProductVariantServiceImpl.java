package com.zola.services.product;

import com.zola.dto.response.attribute.ColorResponse;
import com.zola.dto.response.product.ProductVariantResponse;
import com.zola.dto.response.attribute.SizeResponse;
import com.zola.entity.ProductVariant;
import com.zola.repository.ProductVariantRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductVariantServiceImpl implements ProductVariantService {

    ProductVariantRepository productVariantRepository;

    @Override
    public ProductVariantResponse updateStock(Long id, Integer quantity) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variant not found"));
        variant.setStockQuantity(quantity);
        variant = productVariantRepository.save(variant);

        SizeResponse sizeResp = variant.getSize() != null ? SizeResponse.builder()
                .id(variant.getSize().getId())
                .name(variant.getSize().getName())
                .build() : null;

        ColorResponse colorResp = variant.getColor() != null ? ColorResponse.builder()
                .id(variant.getColor().getId())
                .name(variant.getColor().getName())
                .hexCode(variant.getColor().getHexCode())
                .build() : null;

        return ProductVariantResponse.builder()
                .id(variant.getId())
                .size(sizeResp)
                .color(colorResp)
                .stockQuantity(variant.getStockQuantity())
                .build();
    }
}
