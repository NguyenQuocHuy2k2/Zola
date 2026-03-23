package com.zola.enums;

import lombok.Getter;

@Getter
public enum CancellationReason {
    // User Reasons
    CHANGE_MIND("Thay đổi ý định", ReasonRole.USER),
    WRONG_INFO("Sai thông tin", ReasonRole.USER),
    PAYMENT_ISSUE("Vấn đề thanh toán", ReasonRole.USER),
    TIME_DELAY("Thời gian", ReasonRole.USER),
    FORGOT_VOUCHER("Quên áp mã", ReasonRole.USER),

    // Admin Reasons
    OUT_OF_STOCK("Hết hàng", ReasonRole.ADMIN),
    PRODUCT_FAULT("Sản phẩm lỗi", ReasonRole.ADMIN),
    NO_CONTACT("Không liên lạc được", ReasonRole.ADMIN),
    INVALID_ADDRESS("Địa chỉ không hợp lệ", ReasonRole.ADMIN),
    FRAUD_SUSPICION("Nghi ngờ gian lận", ReasonRole.ADMIN),
    PRICING_ERROR("Sai sót về giá", ReasonRole.ADMIN),

    OTHER("Lý do khác", ReasonRole.BOTH);

    private final String description;
    private final ReasonRole role;

    CancellationReason(String description, ReasonRole role) {
        this.description = description;
        this.role = role;
    }

    public enum ReasonRole {
        USER, ADMIN, BOTH
    }
}
