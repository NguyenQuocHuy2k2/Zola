package com.zola.controllers;

import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.dashboard.DashboardResponse;
import com.zola.services.dashboard.DashboardService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zola.dto.response.dashboard.DailyOrderStat;
import com.zola.dto.response.dashboard.LowStockProduct;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardController {
    DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<DashboardResponse> getStats() {
        return ApiResponse.<DashboardResponse>builder()
                .result(dashboardService.getStats())
                .build();
    }

    @GetMapping("/daily-orders")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<List<DailyOrderStat>> getDailyOrders(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ApiResponse.<List<DailyOrderStat>>builder()
                .result(dashboardService.getDailyOrders(startDate, endDate))
                .build();
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<List<LowStockProduct>> getLowStockProducts() {
        return ApiResponse.<List<LowStockProduct>>builder()
                .result(dashboardService.getLowStockProducts())
                .build();
    }
}
