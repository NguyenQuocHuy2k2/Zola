package com.zola.services.product;

import com.zola.converters.ProductConverter;

import com.zola.dto.request.product.ProductRequest;
import com.zola.dto.response.product.ProductResponse;
import com.zola.entity.*;
import com.zola.enums.ProductStatus;
import com.zola.repository.*;
import com.zola.services.cloudinary.CloudinaryService;
import com.zola.services.search.SearchHistoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.zola.dto.request.product.SearchProductRequest;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductServiceImpl implements ProductService {

    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    SizeRepository sizeRepository;
    ColorRepository colorRepository;
    CloudinaryService cloudinaryService;
    SearchHistoryService searchHistoryService;
    ProductVariantRepository productVariantRepository;
    ProductImageRepository productImageRepository;
    ProductConverter productConverter;

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .basePrice(request.getBasePrice())
                .status(request.getStatus() != null ? ProductStatus.valueOf(request.getStatus()) : ProductStatus.ACTIVE)
                .category(category)
                .build();

        Product savedProduct = productRepository.save(product);

        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            List<ProductVariant> variants = request.getVariants().stream().map(vReq -> {
                Size size = vReq.getSizeId() != null ? sizeRepository.findById(vReq.getSizeId()).orElse(null) : null;
                Color color = vReq.getColorId() != null ? colorRepository.findById(vReq.getColorId()).orElse(null) : null;

                ProductVariant variant = ProductVariant.builder()
                        .product(savedProduct)
                        .size(size)
                        .color(color)
                        .stockQuantity(vReq.getStockQuantity())
                        .build();
                return productVariantRepository.save(variant);
            }).collect(Collectors.toList());
            savedProduct.setVariants(variants);
        }

        return productConverter.toProductResponse(savedProduct);
    }

    @Override
    @Transactional
    public ProductResponse uploadImages(String productId, List<MultipartFile> files) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        boolean isFirst = product.getImages().isEmpty();
        for (MultipartFile file : files) {
            String uniqueSuffix = java.util.UUID.randomUUID().toString().substring(0, 8);
            String imageUrl = cloudinaryService.uploadImage(file, "zola/products", "product_" + productId + "_" + uniqueSuffix);
            ProductImage image = ProductImage.builder()
                    .imageUrl(imageUrl)
                    .isPrimary(isFirst)
                    .product(product)
                    .build();
            productImageRepository.save(image);
            product.getImages().add(image);
            isFirst = false;
        }

        return productConverter.toProductResponse(productRepository.save(product));
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productConverter::toProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ProductResponse> getProductsPaged(int page, int size) {
        return productRepository.findAll(PageRequest.of(page, size))
                .map(productConverter::toProductResponse);
    }

    @Override
    public Page<ProductResponse> getProductsByCategory(int categoryId, int page, int size) {
        return productRepository.findByCategoryId(categoryId, PageRequest.of(page, size))
                .map(productConverter::toProductResponse);
    }

    @Override
    public Page<ProductResponse> searchProducts(SearchProductRequest request) {
        if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
            try {
                searchHistoryService.saveKeyword(request.getKeyword());
            } catch (Exception ignored) {
                // User may not be authenticated — history saving is optional
            }
        }

        return productRepository.searchProducts(
                        request.getKeyword(),
                        request.getCategoryId(),
                        request.getMinPrice(),
                        request.getMaxPrice(),
                        request.getColorId(),
                        request.getSizeId(),
                        PageRequest.of(request.getPage(), request.getSize()))
                .map(productConverter::toProductResponse);
    }

    @Override
    public ProductResponse getProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return productConverter.toProductResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(String id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBasePrice(request.getBasePrice());
        product.setStatus(request.getStatus() != null ? ProductStatus.valueOf(request.getStatus()) : ProductStatus.ACTIVE);
        product.setCategory(category);

        productVariantRepository.deleteAll(product.getVariants());
        product.getVariants().clear();

        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            List<ProductVariant> variants = request.getVariants().stream().map(vReq -> {
                Size size = vReq.getSizeId() != null ? sizeRepository.findById(vReq.getSizeId()).orElse(null) : null;
                Color color = vReq.getColorId() != null ? colorRepository.findById(vReq.getColorId()).orElse(null) : null;

                ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .size(size)
                        .color(color)
                        .stockQuantity(vReq.getStockQuantity())
                        .build();
                return variant;
            }).collect(Collectors.toList());
            productVariantRepository.saveAll(variants);
            product.setVariants(variants);
        }

        Product savedProduct = productRepository.save(product);
        return productConverter.toProductResponse(savedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductResponse> getHotProducts() {
        return productRepository.findTop10ByOrderByFavoriteCountDesc(PageRequest.of(0, 10))
                .stream()
                .map(productConverter::toProductResponse)
                .collect(Collectors.toList());
    }
}
