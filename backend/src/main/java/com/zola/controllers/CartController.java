package com.zola.controllers;

import com.zola.dto.request.cart.CartItemRequest;
import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.cart.CartItemResponse;
import com.zola.services.cart.CartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {
    CartService cartService;

    @PostMapping
    public ApiResponse<CartItemResponse> addToCart(@RequestBody CartItemRequest request) {
        return ApiResponse.<CartItemResponse>builder()
                .result(cartService.addToCart(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<CartItemResponse>> getCart() {
        return ApiResponse.<List<CartItemResponse>>builder()
                .result(cartService.getCart())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CartItemResponse> updateQuantity(
            @PathVariable String id,
            @RequestParam Integer quantity) {
        return ApiResponse.<CartItemResponse>builder()
                .result(cartService.updateQuantity(id, quantity))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> removeFromCart(@PathVariable String id) {
        cartService.removeFromCart(id);
        return ApiResponse.<Void>builder()
                .message("Item removed from cart")
                .build();
    }

    @DeleteMapping("/clear")
    public ApiResponse<Void> clearCart() {
        cartService.clearCart();
        return ApiResponse.<Void>builder()
                .message("Cart cleared")
                .build();
    }
}
