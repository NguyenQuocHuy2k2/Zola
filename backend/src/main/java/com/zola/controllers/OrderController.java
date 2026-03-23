package com.zola.controllers;

import com.zola.dto.request.order.OrderRequest;
import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.order.CancellationReasonResponse;
import com.zola.dto.response.order.OrderResponse;
import com.zola.enums.CancellationReason;
import com.zola.enums.OrderStatus;
import com.zola.services.order.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    @PostMapping("/checkout")
    public ApiResponse<OrderResponse> checkout(@Valid @RequestBody OrderRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.checkout(request))
                .build();
    }

    @GetMapping("/my-orders")
    public ApiResponse<List<OrderResponse>> getMyOrders() {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.getMyOrders())
                .build();
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<List<OrderResponse>> getAllOrders() {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.getAllOrders())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable String id) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.getOrderById(id))
                .build();
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<OrderResponse> updateStatus(
            @PathVariable String id, 
            @RequestParam OrderStatus status,
            @RequestParam(required = false) CancellationReason reason) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.updateStatus(id, status, reason))
                .build();
    }

    @PostMapping("/{id}/cancel")
    public ApiResponse<String> cancelOrder(
            @PathVariable String id,
            @RequestParam(required = false) CancellationReason reason) {
        orderService.cancelOrder(id, reason);
        return ApiResponse.<String>builder()
                .result("Order cancelled successfully")
                .build();
    }

    @GetMapping("/cancellation-reasons")
    public ApiResponse<List<CancellationReasonResponse>> getCancellationReasons(
            @RequestParam(defaultValue = "USER") String role) {
        return ApiResponse.<List<CancellationReasonResponse>>builder()
                .result(orderService.getCancellationReasons(role))
                .build();
    }
}
