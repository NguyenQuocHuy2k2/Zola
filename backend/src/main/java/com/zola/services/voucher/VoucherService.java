package com.zola.services.voucher;

import com.zola.dto.response.voucher.VoucherResponse;
import com.zola.entity.User;

import java.math.BigDecimal;
import java.util.List;

public interface VoucherService {
    VoucherResponse generateVoucherForUser(User user, BigDecimal orderAmount);
    List<VoucherResponse> getMyVouchers();
    VoucherResponse getVoucherByCode(String code);
}
