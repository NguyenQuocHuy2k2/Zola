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
}
