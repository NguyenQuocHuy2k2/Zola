package com.zola.entity;

import com.zola.enums.DiscountType;
import com.zola.enums.VoucherStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "vouchers")
@EntityListeners(AuditingEntityListener.class)
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "code", unique = true, nullable = false)
    String code;

    @Column(name = "discount_value", nullable = false)
    BigDecimal discountValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    DiscountType discountType;

    @Column(name = "min_order_amount")
    BigDecimal minOrderAmount;

    @Column(name = "max_discount_amount")
    BigDecimal maxDiscountAmount;

    @Column(name = "start_date")
    LocalDateTime startDate;

    @Column(name = "expiry_date")
    LocalDateTime expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    VoucherStatus status = VoucherStatus.ACTIVE;

    @Column(name = "description")
    String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User user;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;
}
