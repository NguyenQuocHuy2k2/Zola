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

import com.zola.dto.response.dashboard.DailyOrderStat;
import com.zola.dto.response.dashboard.LowStockProduct;
import com.zola.entity.ProductVariant;
import com.zola.repository.ProductVariantRepository;
import org.springframework.data.domain.PageRequest;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardServiceImpl implements DashboardService {
    OrderRepository orderRepository;
    ProductRepository productRepository;
    UserRepository userRepository;
    ProductVariantRepository productVariantRepository;

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

    @Override
    public List<DailyOrderStat> getDailyOrders(LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> rawStats = orderRepository.countDailyOrdersRaw(startDate, endDate);
        return rawStats.stream().map(obj -> DailyOrderStat.builder()
                .date((String) obj[0])
                .count(((Number) obj[1]).longValue())
                .build()).toList();
    }

    @Override
    public List<LowStockProduct> getLowStockProducts() {
        List<ProductVariant> variants = productVariantRepository.findLowStockVariants(10, PageRequest.of(0, 10));
        return variants.stream().map(v -> {
            String imageUrl = v.getProduct().getImages().isEmpty() ? null : v.getProduct().getImages().get(0).getImageUrl();
            return LowStockProduct.builder()
                .productId(v.getProduct().getId())
                .productName(v.getProduct().getName())
                .productVariantId(v.getId().toString())
                .size(v.getSize() != null ? v.getSize().getName() : null)
                .color(v.getColor() != null ? v.getColor().getName() : null)
                .stockQuantity(v.getStockQuantity())
                .imageUrl(imageUrl)
                .price(v.getProduct().getBasePrice())
                .categoryName(v.getProduct().getCategory() != null ? v.getProduct().getCategory().getName() : null)
                .build();
        }).toList();
    }
}
