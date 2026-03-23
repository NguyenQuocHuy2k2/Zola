package com.zola.services.review;

import com.zola.dto.request.order.CreateReviewRequest;
import com.zola.dto.response.order.ReviewResponse;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    ReviewResponse createReview(CreateReviewRequest request);
    Optional<ReviewResponse> getReviewByOrderItem(String orderItemId);
    List<ReviewResponse> getReviewsByProduct(String productId);
}
