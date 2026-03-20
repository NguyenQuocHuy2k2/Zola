package com.zola.controllers;

import com.zola.dto.request.product.ProductVariantRequest;
import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.product.ProductVariantResponse;
import com.zola.services.product.ProductVariantService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductVariantController {

    ProductVariantService productVariantService;

    @PostMapping("/{productId}/variants")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<ProductVariantResponse> createVariant(
            @PathVariable String productId,
            @RequestBody @Valid ProductVariantRequest request) {
        return ApiResponse.<ProductVariantResponse>builder()
                .result(productVariantService.createVariant(productId, request))
                .build();
    }

    @PutMapping("/variants/{id}/stock")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<ProductVariantResponse> updateStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        return ApiResponse.<ProductVariantResponse>builder()
                .result(productVariantService.updateStock(id, quantity))
                .build();
    }

    @DeleteMapping("/variants/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<String> deleteVariant(@PathVariable Long id) {
        productVariantService.deleteVariant(id);
        return ApiResponse.<String>builder()
                .result("Variant deleted successfully")
                .build();
    }
}
