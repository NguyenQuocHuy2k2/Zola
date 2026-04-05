package com.zola.repository;

import com.zola.entity.CartItem;
import com.zola.entity.ProductVariant;
import com.zola.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, String> {
    List<CartItem> findByUserOrderByCreatedAtDesc(User user);

    @Query("SELECT c FROM CartItem c WHERE c.user = :user AND c.productVariant = :variant")
    Optional<CartItem> findByUserAndProductVariant(@Param("user") User user, @Param("variant") ProductVariant variant);

    List<CartItem> findAllByIdInAndUser(List<String> ids, User user);

    void deleteByUser(User user);
}
