package com.zola.services.product;

import com.zola.converters.ProductConverter;

import com.zola.dto.response.product.ProductResponse;
import com.zola.entity.FavoriteProduct;
import com.zola.entity.Product;
import com.zola.entity.User;
import com.zola.repository.FavoriteProductRepository;
import com.zola.repository.ProductRepository;
import com.zola.repository.UserRepository;
import com.zola.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FavoriteProductServiceImpl implements FavoriteProductService {

    FavoriteProductRepository favoriteProductRepository;
    ProductRepository productRepository;
    UserRepository userRepository;
    ProductConverter productConverter;

    @Override
    @Transactional
    public void toggleFavorite(String productId) {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<FavoriteProduct> favoriteOpt = favoriteProductRepository.findByUserAndProduct(user, product);

        if (favoriteOpt.isPresent()) {
            favoriteProductRepository.delete(favoriteOpt.get());
            product.setFavoriteCount(Math.max(0, product.getFavoriteCount() - 1));
        } else {
            FavoriteProduct favorite = FavoriteProduct.builder()
                    .user(user)
                    .product(product)
                    .build();
            favoriteProductRepository.save(favorite);
            product.setFavoriteCount(product.getFavoriteCount() + 1);
        }
        productRepository.save(product);
    }

    @Override
    public boolean isFavorite(String productId) {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return favoriteProductRepository.existsByUserAndProduct(user, product);
    }

    @Override
    public Page<ProductResponse> getFavorites(int page, int size) {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        return favoriteProductRepository.findByUser(user, pageable)
                .map(favorite -> productConverter.toProductResponse(favorite.getProduct()));
    }
}
