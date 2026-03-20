package com.zola.services.product;

import com.zola.dto.response.product.ProductVariantResponse;

public interface ProductVariantService {
    ProductVariantResponse createVariant(String productId, com.zola.dto.request.product.ProductVariantRequest request);
    ProductVariantResponse updateStock(Long id, Integer quantity);
    void deleteVariant(Long id);
}
