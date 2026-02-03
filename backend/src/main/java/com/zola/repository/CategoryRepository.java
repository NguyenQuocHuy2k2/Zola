package com.zola.repository;

import com.zola.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // API hiển thị danh sách category theo chiều ngang
}
