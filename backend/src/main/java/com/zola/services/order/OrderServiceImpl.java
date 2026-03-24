package com.zola.services.order;

import com.zola.converters.OrderConverter;
import com.zola.dto.request.order.OrderRequest;
import com.zola.dto.response.order.CancellationReasonResponse;
import com.zola.dto.response.order.OrderResponse;
import com.zola.entity.CartItem;
import com.zola.entity.Order;
import com.zola.entity.OrderItem;
import com.zola.entity.ProductVariant;
import com.zola.entity.User;
import com.zola.enums.CancellationReason;
import com.zola.enums.CancellationReason.ReasonRole;
import com.zola.enums.OrderStatus;
import com.zola.repository.CartItemRepository;
import com.zola.repository.OrderRepository;
import com.zola.repository.UserRepository;
import com.zola.exception.AppException;
import com.zola.exception.ErrorCode;
import com.zola.utils.SecurityUtils;
import com.zola.services.notification.NotificationService;
import com.zola.services.voucher.VoucherService;
import com.zola.repository.VoucherRepository;
import com.zola.enums.NotificationType;
import com.zola.enums.VoucherStatus;
import com.zola.enums.DiscountType;
import com.zola.entity.Voucher;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
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
    NotificationService notificationService;
    VoucherService voucherService;
    VoucherRepository voucherRepository;

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
            ProductVariant variant = cartItem.getProductVariant();
            
            // Check stock: Available = stockQuantity - reservedQuantity
            int availableStock = variant.getStockQuantity() - variant.getReservedQuantity();
            if (availableStock < cartItem.getQuantity()) {
                throw new AppException(ErrorCode.PRODUCT_OUT_OF_STOCK);
            }

            // Increase reservedQuantity
            variant.setReservedQuantity(variant.getReservedQuantity() + cartItem.getQuantity());

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productVariant(variant)
                    .quantity(cartItem.getQuantity())
                    .price(variant.getProduct().getBasePrice())
                    .build();
            orderItems.add(orderItem);
        }
        order.setItems(orderItems);

        // Handle Voucher Application
        if (request.getVoucherCode() != null && !request.getVoucherCode().isEmpty()) {
            Voucher voucher = voucherRepository.findByCode(request.getVoucherCode().toUpperCase())
                    .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

            validateVoucher(voucher, user, totalAmount);

            BigDecimal discount = calculateDiscount(voucher, totalAmount);
            order.setDiscountAmount(discount);
            order.setVoucher(voucher);
            
            // Subtract discount from total amount
            totalAmount = totalAmount.subtract(discount);
            order.setTotalAmount(totalAmount);

            // Mark voucher as used
            voucher.setStatus(VoucherStatus.USED);
            voucherRepository.save(voucher);
        }

        Order savedOrder = orderRepository.save(order);

        // Clear cart after successful checkout
        cartItemRepository.deleteAll(cartItems);

        // Create notification for new order
        notificationService.createNotification(user, "Đặt hàng thành công", 
            "Đơn hàng " + savedOrder.getOrderCode() + " của bạn đã được đặt thành công.", 
            NotificationType.ORDER);

        notificationService.notifyAdmins("Đơn hàng mới", 
            "Có đơn hàng mới " + savedOrder.getOrderCode() + " cần được xác nhận.", 
            NotificationType.ORDER);

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
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(orderConverter::toOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        
        String userId = SecurityUtils.getCurrentUserId();
        // Check if order belongs to current user OR user is ADMIN
        if (!order.getUser().getId().equals(userId) && !SecurityUtils.isAdmin()) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        return orderConverter.toOrderResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updateStatus(String id, OrderStatus newStatus, CancellationReason reason) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        
        OrderStatus oldStatus = order.getStatus();
        if (oldStatus == newStatus) return orderConverter.toOrderResponse(order);

        // Validate transition
        validateStatusTransition(oldStatus, newStatus);

        // Handle Stock Adjustments
        handleStockAdjustment(order, oldStatus, newStatus);

        order.setStatus(newStatus);
        if (newStatus == OrderStatus.CANCELLED) {
            order.setCancellationReason(reason);
        }

        Order savedOrder = orderRepository.save(order);

        // Create notification for status update
        String title = "Cập nhật đơn hàng";
        String message = "Đơn hàng " + savedOrder.getOrderCode() + " của bạn đã chuyển sang trạng thái: " + newStatus.name();
        notificationService.createNotification(savedOrder.getUser(), title, message, NotificationType.ORDER);

        // Generate voucher if order is RECEIVED
        if (newStatus == OrderStatus.RECEIVED) {
            voucherService.generateVoucherForUser(savedOrder.getUser(), savedOrder.getTotalAmount());
        }

        return orderConverter.toOrderResponse(savedOrder);
    }

    private void validateStatusTransition(OrderStatus oldStatus, OrderStatus newStatus) {
        if (oldStatus == OrderStatus.CANCELLED || oldStatus == OrderStatus.RECEIVED) {
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS_TRANSITION);
        }

        // Admin can cancel anytime (except if already cancelled/received)
        if (newStatus == OrderStatus.CANCELLED) return;

        // For Admin: Allow any forward progression
        if (SecurityUtils.isAdmin()) {
            if (newStatus.ordinal() > oldStatus.ordinal()) return;
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS_TRANSITION);
        }

        // For non-admin: Must follow strict sequential order
        boolean valid = switch (oldStatus) {
            case PENDING -> newStatus == OrderStatus.CONFIRMED;
            case CONFIRMED -> newStatus == OrderStatus.PREPARING;
            case PREPARING -> newStatus == OrderStatus.SHIPPING;
            case SHIPPING -> newStatus == OrderStatus.RECEIVED;
            default -> false;
        };

        if (!valid) {
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS_TRANSITION);
        }
    }

    private void handleStockAdjustment(Order order, OrderStatus oldStatus, OrderStatus newStatus) {
        // If moving OUT of PENDING (and not to CANCELLED), we need to deduct stock
        if (oldStatus == OrderStatus.PENDING && newStatus != OrderStatus.CANCELLED && newStatus != OrderStatus.PENDING) {
            // Deduct physical stock, release reserved stock
            for (OrderItem item : order.getItems()) {
                ProductVariant variant = item.getProductVariant();
                variant.setStockQuantity(variant.getStockQuantity() - item.getQuantity());
                variant.setReservedQuantity(variant.getReservedQuantity() - item.getQuantity());
            }
        } else if (newStatus == OrderStatus.CANCELLED) {
            if (oldStatus == OrderStatus.PENDING) {
                // Return reserved stock
                for (OrderItem item : order.getItems()) {
                    ProductVariant variant = item.getProductVariant();
                    variant.setReservedQuantity(variant.getReservedQuantity() - item.getQuantity());
                }
            } else {
                // Return physical stock (since it was already deducted at CONFIRMED)
                for (OrderItem item : order.getItems()) {
                    ProductVariant variant = item.getProductVariant();
                    variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                }
            }
        }
    }

    @Override
    @Transactional
    public void cancelOrder(String id, CancellationReason reason) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        
        String userId = SecurityUtils.getCurrentUserId();
        boolean isAdmin = SecurityUtils.isAdmin();

        if (!isAdmin && !order.getUser().getId().equals(userId)) {
             throw new AppException(ErrorCode.FORBIDDEN);
        }

        if (!isAdmin) {
            if (order.getStatus() != OrderStatus.PENDING) {
                throw new AppException(ErrorCode.ORDER_CANNOT_CANCEL);
            }

            // Check time limit (30 minutes)
            if (order.getCreatedAt().plusMinutes(30).isBefore(LocalDateTime.now())) {
                throw new AppException(ErrorCode.ORDER_CANCEL_TIME_EXCEEDED);
            }
        }

        updateStatus(id, OrderStatus.CANCELLED, reason);

        // Notify admins if cancelled by user
        if (!isAdmin) {
            notificationService.notifyAdmins(
                "Đơn hàng bị khách hủy",
                "Đơn hàng " + order.getOrderCode() + " đã bị khách hàng hủy.",
                com.zola.enums.NotificationType.ORDER
            );
        }
    }

    private String generateOrderCode() {
        String datePart = LocalDateTime.now().format(DATE_FORMATTER);
        StringBuilder randomPart = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            randomPart.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return "ZOLA-" + datePart + randomPart.toString();
    }

    @Override
    public List<CancellationReasonResponse> getCancellationReasons(String role) {
        ReasonRole targetRole = role.equalsIgnoreCase("ADMIN") 
                ? ReasonRole.ADMIN 
                : ReasonRole.USER;

        return Arrays.stream(CancellationReason.values())
                .filter(reason -> reason.getRole() == targetRole || reason.getRole() == ReasonRole.BOTH)
                .map(orderConverter::toCancellationReasonResponse)
                .collect(Collectors.toList());
    }

    private void validateVoucher(Voucher voucher, User user, BigDecimal orderTotal) {
        if (voucher.getStatus() != VoucherStatus.ACTIVE) {
            throw new AppException(ErrorCode.VOUCHER_NOT_ACTIVE);
        }
        if (voucher.getUser() != null && !voucher.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.VOUCHER_NOT_BELONG_TO_USER);
        }
        if (voucher.getExpiryDate() != null && voucher.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.VOUCHER_EXPIRED);
        }
        if (voucher.getMinOrderAmount() != null && orderTotal.compareTo(voucher.getMinOrderAmount()) < 0) {
            throw new AppException(ErrorCode.VOUCHER_MIN_AMOUNT_NOT_REACHED);
        }
    }

    private BigDecimal calculateDiscount(Voucher voucher, BigDecimal orderTotal) {
        if (voucher.getDiscountType() == DiscountType.FIXED) {
            return voucher.getDiscountValue().min(orderTotal);
        } else {
            BigDecimal discount = orderTotal.multiply(voucher.getDiscountValue())
                    .divide(new BigDecimal("100"));
            if (voucher.getMaxDiscountAmount() != null) {
                discount = discount.min(voucher.getMaxDiscountAmount());
            }
            return discount.min(orderTotal);
        }
    }
}
