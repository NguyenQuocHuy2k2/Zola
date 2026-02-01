package com.zola.services.order;

import com.zola.converters.OrderConverter;
import com.zola.dto.request.order.OrderRequest;
import com.zola.dto.response.order.OrderResponse;
import com.zola.entity.CartItem;
import com.zola.entity.Order;
import com.zola.entity.OrderItem;
import com.zola.entity.User;
import com.zola.enums.OrderStatus;
import com.zola.repository.CartItemRepository;
import com.zola.repository.OrderRepository;
import com.zola.repository.UserRepository;
import com.zola.exception.AppException;
import com.zola.exception.ErrorCode;
import com.zola.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.format.DateTimeFormatter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderServiceImpl implements OrderService {
    OrderRepository orderRepository;
    CartItemRepository cartItemRepository;
    UserRepository userRepository;
    OrderConverter orderConverter;

    static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    static final SecureRandom RANDOM = new SecureRandom();
    static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

    @Override
    @Transactional
    public OrderResponse checkout(OrderRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findAllByIdInAndUser(request.getCartItemIds(), user);
        
        // Check if all requested items exist for this user
        if (cartItems.size() != request.getCartItemIds().size()) {
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
        }

        BigDecimal totalAmount = cartItems.stream()
                .map(item -> item.getProductVariant().getProduct().getBasePrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .totalAmount(totalAmount)
                .shippingAddress(request.getShippingAddress())
                .phoneNumber(request.getPhoneNumber())
                .paymentMethod(request.getPaymentMethod())
                .notes(request.getNotes())
                .orderCode(generateOrderCode())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productVariant(cartItem.getProductVariant())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getProductVariant().getProduct().getBasePrice())
                    .build();
            orderItems.add(orderItem);
        }
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Clear cart after successful checkout
        cartItemRepository.deleteAll(cartItems);

        return orderConverter.toOrderResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getMyOrders() {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(orderConverter::toOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        
        // Check if order belongs to current user (unless admin, but for simplicity now...)
        String userId = SecurityUtils.getCurrentUserId();
        if (!order.getUser().getId().equals(userId)) {
            // Check if user is admin (optional)
            // throw new RuntimeException("Access denied");
        }

        return orderConverter.toOrderResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updateStatus(String id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        order.setStatus(status);
        return orderConverter.toOrderResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public void cancelOrder(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        
        String userId = SecurityUtils.getCurrentUserId();
        if (!order.getUser().getId().equals(userId)) {
             throw new AppException(ErrorCode.FORBIDDEN);
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new AppException(ErrorCode.ORDER_CANNOT_CANCEL);
        }

        // Check time limit (30 minutes)
        if (order.getCreatedAt().plusMinutes(30).isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.ORDER_CANCEL_TIME_EXCEEDED);
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    private String generateOrderCode() {
        String datePart = LocalDateTime.now().format(DATE_FORMATTER);
        StringBuilder randomPart = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            randomPart.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return "ZOLA-" + datePart + randomPart.toString();
    }
}
