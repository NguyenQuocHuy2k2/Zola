package com.zola.repository;

import com.zola.entity.Product;
import com.zola.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
  Page<Product> findByCategoryId(Integer categoryId, Pageable pageable);

  Page<Product> findByStatus(ProductStatus status, Pageable pageable);

  @Query("SELECT p FROM Product p ORDER BY p.favoriteCount DESC")
  List<Product> findTop10ByOrderByFavoriteCountDesc(Pageable pageable);

  @Query("SELECT DISTINCT p FROM Product p " +
      "LEFT JOIN p.variants v " +
      "WHERE (:useSemanticSearch = false AND (:keyword IS NULL OR :keyword = '' OR LOWER(p.name) LIKE CONCAT('%', LOWER(:keyword), '%') OR LOWER(p.description) LIKE CONCAT('%', LOWER(:keyword), '%')) " +
      "   OR (:useSemanticSearch = true AND p.id IN :productIds)) " +
      "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
      "AND (:minPrice IS NULL OR p.basePrice >= :minPrice) " +
      "AND (:maxPrice IS NULL OR p.basePrice <= :maxPrice) " +
      "AND (:colorId IS NULL OR v.color.id = :colorId) " +
      "AND (:sizeId IS NULL OR v.size.id = :sizeId) " +
      "AND (:status IS NULL OR p.status = :status)")
  Page<Product> searchProducts(
      @Param("keyword") String keyword,
      @Param("useSemanticSearch") boolean useSemanticSearch,
      @Param("productIds") List<String> productIds,
      @Param("categoryId") Integer categoryId,
      @Param("minPrice") BigDecimal minPrice,
      @Param("maxPrice") BigDecimal maxPrice,
      @Param("colorId") Integer colorId,
      @Param("sizeId") Integer sizeId,
      @Param("status") ProductStatus status,
      Pageable pageable);
}
