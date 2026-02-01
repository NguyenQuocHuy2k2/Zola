package com.zola.services.product;

import com.zola.dto.response.product.ProductResponse;
import org.springframework.data.domain.Page;

public interface FavoriteProductService {
    void toggleFavorite(String productId);
    boolean isFavorite(String productId);
    Page<ProductResponse> getFavorites(int page, int size);
}
