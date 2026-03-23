package com.zola.services.review;

import com.zola.converters.ReviewConverter;
import com.zola.dto.request.order.CreateReviewRequest;
import com.zola.dto.response.order.ReviewResponse;
import com.zola.entity.OrderItem;
import com.zola.entity.Product;
import com.zola.entity.Review;
import com.zola.entity.User;
import com.zola.enums.OrderStatus;
import com.zola.exception.AppException;
import com.zola.exception.ErrorCode;
import com.zola.repository.OrderItemRepository;
import com.zola.repository.ReviewRepository;
import com.zola.repository.UserRepository;
import com.zola.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewServiceImpl implements ReviewService {

    ReviewRepository reviewRepository;
    OrderItemRepository orderItemRepository;
    UserRepository userRepository;
    ReviewConverter reviewConverter;

    @Override
    @Transactional
    public ReviewResponse createReview(CreateReviewRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_ITEM_NOT_FOUND));

        // Ensure the order belongs to the current user
        if (!orderItem.getOrder().getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        // Only allow review on RECEIVED orders
        if (orderItem.getOrder().getStatus() != OrderStatus.RECEIVED) {
            throw new AppException(ErrorCode.ORDER_NOT_RECEIVED);
        }

        // Prevent duplicate reviews
        if (reviewRepository.existsByOrderItemId(request.getOrderItemId())) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        Product product = orderItem.getProductVariant().getProduct();

        Review review = Review.builder()
                .orderItem(orderItem)
                .product(product)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return reviewConverter.toReviewResponse(reviewRepository.save(review));
    }

    @Override
    public Optional<ReviewResponse> getReviewByOrderItem(String orderItemId) {
        return reviewRepository.findByOrderItemId(orderItemId)
                .map(reviewConverter::toReviewResponse);
    }

    @Override
    public List<ReviewResponse> getReviewsByProduct(String productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(reviewConverter::toReviewResponse)
                .collect(Collectors.toList());
    }
}
