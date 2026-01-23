package com.zola.repository;

import com.zola.entity.OtpCode;
import com.zola.enums.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCode, String> {

    Optional<OtpCode> findByEmailAndOtpCodeAndType(String email, String otpCode, OtpType type);

    Optional<OtpCode> findByEmailAndType(String email, OtpType type);

    void deleteByEmail(String email);

    void deleteByEmailAndType(String email, OtpType type);
}
