package com.zola.services.product;

import com.zola.dto.response.product.ProductVariantResponse;

public interface ProductVariantService {
    ProductVariantResponse updateStock(Long id, Integer quantity);
}
