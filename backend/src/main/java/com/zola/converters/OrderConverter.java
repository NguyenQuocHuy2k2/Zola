package com.zola.converters;

import com.zola.dto.response.order.CancellationReasonResponse;
import com.zola.dto.response.order.OrderItemResponse;
import com.zola.dto.response.order.OrderResponse;
import com.zola.enums.CancellationReason;
import com.zola.entity.Order;
import com.zola.entity.OrderItem;
import com.zola.entity.ProductImage;
import com.zola.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrderConverter {

    private final ReviewRepository reviewRepository;

    public OrderResponse toOrderResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .status(order.getStatus())
                .customerName(order.getUser().getFirstName() + " " + order.getUser().getLastName())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .phoneNumber(order.getPhoneNumber())
                .paymentMethod(order.getPaymentMethod())
                .notes(order.getNotes())
                .cancellationReason(order.getCancellationReason())
                .createdAt(order.getCreatedAt())
                .items(order.getItems().stream()
                        .map(this::toOrderItemResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    public OrderItemResponse toOrderItemResponse(OrderItem item) {
        String imageUrl = item.getProductVariant().getProduct().getImages().stream()
                .filter(ProductImage::getIsPrimary)
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(null);

        if (imageUrl == null && !item.getProductVariant().getProduct().getImages().isEmpty()) {
            imageUrl = item.getProductVariant().getProduct().getImages().get(0).getImageUrl();
        }

        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductVariant().getProduct().getId())
                .productName(item.getProductVariant().getProduct().getName())
                .productVariantId(item.getProductVariant().getId())
                .imageUrl(imageUrl)
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .reviewed(reviewRepository.existsByOrderItemId(item.getId()))
                .build();
    }

    public CancellationReasonResponse toCancellationReasonResponse(CancellationReason reason) {
        if (reason == null) return null;
        return CancellationReasonResponse.builder()
                .code(reason.name())
                .label(reason.getDescription())
                .build();
    }
}
