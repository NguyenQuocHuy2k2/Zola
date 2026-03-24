package com.zola.services.voucher;

import com.zola.converters.VoucherConverter;
import com.zola.dto.response.voucher.VoucherResponse;
import com.zola.entity.User;
import com.zola.entity.Voucher;
import com.zola.enums.DiscountType;
import com.zola.enums.NotificationType;
import com.zola.enums.VoucherStatus;
import com.zola.repository.UserRepository;
import com.zola.repository.VoucherRepository;
import com.zola.services.notification.NotificationService;
import com.zola.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VoucherServiceImpl implements VoucherService {
    VoucherRepository voucherRepository;
    UserRepository userRepository;
    VoucherConverter voucherConverter;
    NotificationService notificationService;

    static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional
    public VoucherResponse generateVoucherForUser(User user, BigDecimal orderAmount) {
        // Simple reward logic: 10% discount for orders > 200k
        if (orderAmount.compareTo(new BigDecimal("200000")) < 0) {
            return null;
        }

        String code = "THANKS-" + generateRandomString(6);
        
        Voucher voucher = Voucher.builder()
                .code(code)
                .discountValue(new BigDecimal("10")) // 10%
                .discountType(DiscountType.PERCENTAGE)
                .minOrderAmount(new BigDecimal("200000"))
                .maxDiscountAmount(new BigDecimal("50000"))
                .startDate(LocalDateTime.now())
                .expiryDate(LocalDateTime.now().plusDays(30))
                .status(VoucherStatus.ACTIVE)
                .description("Mã giảm giá 10% tri ân khách hàng (Tối đa 50k)")
                .user(user)
                .build();

        Voucher savedVoucher = voucherRepository.save(voucher);

        // Send notification
        notificationService.createNotification(
                user,
                "Quà tặng tri ân",
                "Cảm ơn bạn đã mua hàng! Zola tặng bạn mã giảm giá " + code + " giảm 10% cho đơn hàng tiếp theo.",
                NotificationType.PROMOTION
        );

        return voucherConverter.toVoucherResponse(savedVoucher);
    }

    @Override
    public List<VoucherResponse> getMyVouchers() {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return voucherRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(voucherConverter::toVoucherResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VoucherResponse getVoucherByCode(String code) {
        Voucher voucher = voucherRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        
        return voucherConverter.toVoucherResponse(voucher);
    }

    private String generateRandomString(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
}
