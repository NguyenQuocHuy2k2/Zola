package com.zola.converters;

import com.zola.dto.response.voucher.VoucherResponse;
import com.zola.entity.Voucher;
import org.springframework.stereotype.Component;

@Component
public class VoucherConverter {
    public VoucherResponse toVoucherResponse(Voucher voucher) {
        if (voucher == null) return null;
        return VoucherResponse.builder()
                .id(voucher.getId())
                .code(voucher.getCode())
                .discountValue(voucher.getDiscountValue())
                .discountType(voucher.getDiscountType())
                .minOrderAmount(voucher.getMinOrderAmount())
                .maxDiscountAmount(voucher.getMaxDiscountAmount())
                .startDate(voucher.getStartDate())
                .expiryDate(voucher.getExpiryDate())
                .status(voucher.getStatus())
                .description(voucher.getDescription())
                .createdAt(voucher.getCreatedAt())
                .build();
    }
}
