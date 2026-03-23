package com.zola.converters;

import com.zola.dto.response.order.ReviewResponse;
import com.zola.entity.Product;
import com.zola.entity.ProductImage;
import com.zola.entity.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewConverter {

    public ReviewResponse toReviewResponse(Review review) {
        if (review == null) {
            return null;
        }

        Product product = review.getProduct();
        String imageUrl = product.getImages().stream()
                .filter(ProductImage::getIsPrimary)
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(product.getImages().isEmpty() ? null : product.getImages().get(0).getImageUrl());

        return ReviewResponse.builder()
                .id(review.getId())
                .orderItemId(review.getOrderItem().getId())
                .productId(product.getId())
                .productName(product.getName())
                .imageUrl(imageUrl)
                .rating(review.getRating())
                .comment(review.getComment())
                .userFullName(review.getUser().getFirstName() + " " + review.getUser().getLastName())
                .userAvatarUrl(review.getUser().getAvatarUrl())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
