package com.zola.repository;

import com.zola.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {

    Optional<Review> findByOrderItemId(String orderItemId);

    List<Review> findByProductId(String productId);

    boolean existsByOrderItemId(String orderItemId);
}
