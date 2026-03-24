package com.zola.repository;

import com.zola.entity.User;
import com.zola.entity.Voucher;
import com.zola.enums.VoucherStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {
    Optional<Voucher> findByCode(String code);
    List<Voucher> findByUserAndStatus(User user, VoucherStatus status);
    List<Voucher> findByUserOrderByCreatedAtDesc(User user);
}
