package com.zola.repository;

import com.zola.entity.SearchHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    List<SearchHistory> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    Optional<SearchHistory> findByUserIdAndKeywordIgnoreCase(String userId, String keyword);

    void deleteAllByUserId(String userId);
}
