package com.zola.repository;

import com.zola.entity.Order;
import com.zola.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findAllByOrderByCreatedAtDesc();
    List<Order> findByStatusAndDeliveredAtBefore(com.zola.enums.OrderStatus status, LocalDateTime date);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate")
    long countOrdersSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status <> com.zola.enums.OrderStatus.CANCELLED AND o.createdAt >= :startDate")
    java.math.BigDecimal sumRevenueSince(@Param("startDate") LocalDateTime startDate);

    @Query(value = "SELECT CAST(DATE(created_at) AS VARCHAR) as date, COUNT(*) as count FROM orders WHERE created_at >= :startDate AND created_at <= :endDate GROUP BY DATE(created_at) ORDER BY DATE(created_at)", nativeQuery = true)
    List<Object[]> countDailyOrdersRaw(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
