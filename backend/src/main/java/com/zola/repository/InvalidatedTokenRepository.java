package com.zola.repository;

import com.zola.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {

    @Query("SELECT COUNT(t) > 0 FROM InvalidatedToken t WHERE t.accessId = :id OR t.refreshId = :id")
    boolean existsByAccessIdOrRefreshId(String id);

    void deleteByExpirationTimeBefore(java.time.LocalDateTime time);
}
