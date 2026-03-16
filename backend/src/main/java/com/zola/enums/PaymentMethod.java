package com.zola.enums;

import lombok.Getter;

@Getter
public enum PaymentMethod {
    COD("Thanh toán khi nhận hàng"),
    VNPAY("VNPay");

    private final String description;

    PaymentMethod(String description) {
        this.description = description;
    }
}
