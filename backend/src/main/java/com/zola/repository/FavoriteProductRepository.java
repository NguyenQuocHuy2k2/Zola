package com.zola.repository;

import com.zola.entity.FavoriteProduct;
import com.zola.entity.Product;
import com.zola.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, String> {
    Optional<FavoriteProduct> findByUserAndProduct(User user, Product product);
    boolean existsByUserAndProduct(User user, Product product);
    Page<FavoriteProduct> findByUser(User user, Pageable pageable);
}
