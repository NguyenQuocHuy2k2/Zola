package com.zola.services.dashboard;

import com.zola.dto.response.dashboard.DashboardResponse;

import java.time.LocalDateTime;
import java.util.List;
import com.zola.dto.response.dashboard.DailyOrderStat;
import com.zola.dto.response.dashboard.LowStockProduct;

public interface DashboardService {
    DashboardResponse getStats();
    List<DailyOrderStat> getDailyOrders(LocalDateTime startDate, LocalDateTime endDate);
    List<LowStockProduct> getLowStockProducts();
}
