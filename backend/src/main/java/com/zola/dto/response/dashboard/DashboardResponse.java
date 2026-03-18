package com.zola.dto.response.dashboard;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashboardResponse {
    BigDecimal monthlyRevenue;
    long monthlyOrders;
    long totalProducts;
    long totalUsers;
}
