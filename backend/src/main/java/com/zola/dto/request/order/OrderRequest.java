package com.zola.dto.request.order;

import com.zola.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {
    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    String shippingAddress;

    @NotBlank(message = "Số điện thoại không được để trống")
    String phoneNumber;

    @NotNull(message = "Phương thức thanh toán không được để trống")
    PaymentMethod paymentMethod;

    String notes;

    @NotEmpty(message = "Danh sách sản phẩm thanh toán không được để trống")
    List<String> cartItemIds;

    String voucherCode;
}
