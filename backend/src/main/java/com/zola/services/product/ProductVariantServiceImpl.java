package com.zola.services.product;

import com.zola.dto.response.attribute.ColorResponse;
import com.zola.dto.response.product.ProductVariantResponse;
import com.zola.dto.response.attribute.SizeResponse;
import com.zola.entity.ProductVariant;
import com.zola.repository.ColorRepository;
import com.zola.repository.ProductRepository;
import com.zola.repository.ProductVariantRepository;
import com.zola.repository.SizeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductVariantServiceImpl implements ProductVariantService {

    ProductVariantRepository productVariantRepository;
    ProductRepository productRepository;
    SizeRepository sizeRepository;
    ColorRepository colorRepository;

    @Override
    public ProductVariantResponse createVariant(String productId, com.zola.dto.request.product.ProductVariantRequest request) {
        com.zola.entity.Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        com.zola.entity.Size size = sizeRepository.findById(request.getSizeId())
                .orElseThrow(() -> new RuntimeException("Size not found"));
        
        com.zola.entity.Color color = colorRepository.findById(request.getColorId())
                .orElseThrow(() -> new RuntimeException("Color not found"));

        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .size(size)
                .color(color)
                .stockQuantity(request.getStockQuantity())
                .build();

        variant = productVariantRepository.save(variant);
        return mapToResponse(variant);
    }

    @Override
    public ProductVariantResponse updateStock(Long id, Integer quantity) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variant not found"));
        variant.setStockQuantity(quantity);
        variant = productVariantRepository.save(variant);
        return mapToResponse(variant);
    }

    @Override
    public void deleteVariant(Long id) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variant not found"));
        productVariantRepository.delete(variant);
    }

    private ProductVariantResponse mapToResponse(ProductVariant variant) {
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
