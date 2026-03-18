package com.zola.services.dashboard;

import com.zola.dto.response.dashboard.DashboardResponse;
import com.zola.repository.OrderRepository;
import com.zola.repository.ProductRepository;
import com.zola.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardServiceImpl implements DashboardService {
    OrderRepository orderRepository;
    ProductRepository productRepository;
    UserRepository userRepository;

    @Override
    public DashboardResponse getStats() {
        LocalDateTime startOfMonth = LocalDateTime.now()
                .with(TemporalAdjusters.firstDayOfMonth())
                .with(LocalTime.MIN);

        BigDecimal revenue = orderRepository.sumRevenueSince(startOfMonth);
        if (revenue == null) revenue = BigDecimal.ZERO;

        return DashboardResponse.builder()
                .monthlyRevenue(revenue)
                .monthlyOrders(orderRepository.countOrdersSince(startOfMonth))
                .totalProducts(productRepository.count())
                .totalUsers(userRepository.count())
                .build();
    }
}
