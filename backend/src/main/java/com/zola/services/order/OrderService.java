package com.zola.services.order;

import com.zola.dto.request.order.OrderRequest;
import com.zola.dto.response.order.CancellationReasonResponse;
import com.zola.dto.response.order.OrderResponse;
import com.zola.enums.CancellationReason;
import com.zola.enums.OrderStatus;

import java.util.List;

public interface OrderService {
    OrderResponse checkout(OrderRequest request);
    List<OrderResponse> getMyOrders();
    List<OrderResponse> getAllOrders();
    OrderResponse getOrderById(String id);
    OrderResponse updateStatus(String id, OrderStatus status, CancellationReason reason);
    void cancelOrder(String id, CancellationReason reason);
    List<CancellationReasonResponse> getCancellationReasons(String role);
}
