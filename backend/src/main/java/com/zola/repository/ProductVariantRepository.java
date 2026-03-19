package com.zola.repository;

import com.zola.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    List<ProductVariant> findByProductId(String productId);

    @Modifying
    @Query("UPDATE ProductVariant p SET p.deletedAt = :deletedAt WHERE p.id IN :variantIds")
    void softDeleteByIds(@Param("variantIds") List<Long> variantIds, @Param("deletedAt") Instant deletedAt);

    @Query("SELECT p FROM ProductVariant p WHERE p.id IN :variantIds AND p.deletedAt IS NULL")
    List<ProductVariant> findActiveByIds(@Param("variantIds") List<Long> variantIds);

    @Query("SELECT p FROM ProductVariant p WHERE p.product.id = :productId AND p.deletedAt IS NULL")
    List<ProductVariant> findActiveByProductId(@Param("productId") String productId);
}
