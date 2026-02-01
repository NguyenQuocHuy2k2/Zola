package com.zola.dto.response.order;

import com.zola.enums.OrderStatus;
import com.zola.enums.PaymentMethod;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    String id;
    String orderCode;
    OrderStatus status;
    BigDecimal totalAmount;
    String shippingAddress;
    String phoneNumber;
    PaymentMethod paymentMethod;
    String notes;
    LocalDateTime createdAt;
    List<OrderItemResponse> items;
}
