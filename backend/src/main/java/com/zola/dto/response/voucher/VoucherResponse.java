package com.zola.dto.response.voucher;

import com.zola.enums.DiscountType;
import com.zola.enums.VoucherStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherResponse {
    String id;
    String code;
    BigDecimal discountValue;
    DiscountType discountType;
    BigDecimal minOrderAmount;
    BigDecimal maxDiscountAmount;
    LocalDateTime startDate;
    LocalDateTime expiryDate;
    VoucherStatus status;
    String description;
    LocalDateTime createdAt;
}
