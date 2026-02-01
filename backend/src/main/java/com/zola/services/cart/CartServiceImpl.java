package com.zola.services.cart;

import com.zola.converters.CartConverter;
import com.zola.dto.request.cart.CartItemRequest;
import com.zola.dto.response.cart.CartItemResponse;
import com.zola.entity.CartItem;
import com.zola.entity.ProductVariant;
import com.zola.entity.User;
import com.zola.repository.CartItemRepository;
import com.zola.repository.ProductVariantRepository;
import com.zola.repository.UserRepository;
import com.zola.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartServiceImpl implements CartService {
    CartItemRepository cartItemRepository;
    UserRepository userRepository;
    ProductVariantRepository productVariantRepository;
    CartConverter cartConverter;

    @Override
    @Transactional
    public CartItemResponse addToCart(CartItemRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        if (!variant.getProduct().getId().equals(request.getProductId())) {
            throw new RuntimeException("Invalid product variant for product: " + request.getProductId());
        }

        CartItem cartItem = cartItemRepository.findByUserAndProductVariant(user, variant)
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + request.getQuantity());
                    return cartItemRepository.save(existing);
                })
                .orElseGet(() -> {
                    CartItem newItem = CartItem.builder()
                            .user(user)
                            .productVariant(variant)
                            .quantity(request.getQuantity())
                            .build();
                    return cartItemRepository.save(newItem);
                });

        return cartConverter.toCartItemResponse(cartItem);
    }

    @Override
    public List<CartItemResponse> getCart() {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartItemRepository.findByUser(user).stream()
                .map(cartConverter::toCartItemResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CartItemResponse updateQuantity(String id, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        cartItem.setQuantity(quantity);
        return cartConverter.toCartItemResponse(cartItemRepository.save(cartItem));
    }

    @Override
    @Transactional
    public void removeFromCart(String id) {
        cartItemRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void clearCart() {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        cartItemRepository.deleteByUser(user);
    }
}
