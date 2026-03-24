package com.zola.controllers;

import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.voucher.VoucherResponse;
import com.zola.services.voucher.VoucherService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vouchers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VoucherController {
    VoucherService voucherService;

    @GetMapping("/my")
    public ApiResponse<List<VoucherResponse>> getMyVouchers() {
        return ApiResponse.<List<VoucherResponse>>builder()
                .result(voucherService.getMyVouchers())
                .build();
    }

    @GetMapping("/{code}")
    public ApiResponse<VoucherResponse> getVoucherByCode(@PathVariable String code) {
        return ApiResponse.<VoucherResponse>builder()
                .result(voucherService.getVoucherByCode(code))
                .build();
    }
}
