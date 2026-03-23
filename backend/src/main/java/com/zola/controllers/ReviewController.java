package com.zola.controllers;

import com.zola.dto.request.order.CreateReviewRequest;
import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.order.ReviewResponse;
import com.zola.services.review.ReviewService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewController {

    ReviewService reviewService;

    @PostMapping
    public ApiResponse<ReviewResponse> createReview(@Valid @RequestBody CreateReviewRequest request) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.createReview(request))
                .build();
    }

    @GetMapping("/order-item/{orderItemId}")
    public ApiResponse<ReviewResponse> getReviewByOrderItem(@PathVariable String orderItemId) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.getReviewByOrderItem(orderItemId).orElse(null))
                .build();
    }

    @GetMapping("/product/{productId}")
    public ApiResponse<List<ReviewResponse>> getReviewsByProduct(@PathVariable String productId) {
        return ApiResponse.<List<ReviewResponse>>builder()
                .result(reviewService.getReviewsByProduct(productId))
                .build();
    }
}
