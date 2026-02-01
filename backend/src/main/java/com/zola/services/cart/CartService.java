package com.zola.services.cart;

import com.zola.dto.request.cart.CartItemRequest;
import com.zola.dto.response.cart.CartItemResponse;

import java.util.List;

public interface CartService {
    CartItemResponse addToCart(CartItemRequest request);
    List<CartItemResponse> getCart();
    CartItemResponse updateQuantity(String id, Integer quantity);
    void removeFromCart(String id);
    void clearCart();
}
