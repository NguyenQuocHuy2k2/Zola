package com.zola.services.product;

import com.zola.dto.request.product.ProductRequest;
import com.zola.dto.request.product.SearchProductRequest;
import com.zola.dto.response.product.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request);
    ProductResponse uploadImages(String productId, List<MultipartFile> files) throws IOException;
    List<ProductResponse> getAllProducts();
    // API lấy 20 thiết bị giảm giá
    Page<ProductResponse> getProductsPaged(int page, int size);
    Page<ProductResponse> getProductsByCategory(int categoryId, int page, int size);
    Page<ProductResponse> searchProducts(SearchProductRequest request);
    ProductResponse getProduct(String id);
    ProductResponse updateProduct(String id, ProductRequest request);
    void deleteProduct(String id);
    List<ProductResponse> getHotProducts();
}
