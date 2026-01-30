package com.zola.services.search;

import com.zola.dto.response.search.SearchHistoryResponse;
import com.zola.entity.SearchHistory;
import com.zola.entity.User;
import com.zola.exception.AppException;
import com.zola.exception.ErrorCode;
import com.zola.repository.SearchHistoryRepository;
import com.zola.repository.UserRepository;
import com.zola.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SearchHistoryServiceImpl implements SearchHistoryService {

    SearchHistoryRepository searchHistoryRepository;
    UserRepository userRepository;


    @Override
    @Transactional
    public void saveKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return;
        }

        String userId = SecurityUtils.getCurrentUserId();
        String trimmedKeyword = keyword.trim();

        // If keyword already exists, delete and re-insert to bring it to top
        Optional<SearchHistory> existingHistory = searchHistoryRepository.findByUserIdAndKeywordIgnoreCase(userId, trimmedKeyword);
        if (existingHistory.isPresent()) {
            searchHistoryRepository.delete(existingHistory.get());
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        SearchHistory newHistory = SearchHistory.builder()
                .user(user)
                .keyword(trimmedKeyword)
                .build();

        searchHistoryRepository.save(newHistory);
    }

    @Override
    public List<SearchHistoryResponse> getRecentSearches(int limit) {
        String userId = SecurityUtils.getCurrentUserId();
        List<SearchHistory> histories = searchHistoryRepository.findByUserIdOrderByCreatedAtDesc(
                userId, PageRequest.of(0, limit));

        return histories.stream()
                .map(history -> SearchHistoryResponse.builder()
                        .id(history.getId())
                        .keyword(history.getKeyword())
                        .createdAt(history.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteSearchHistory(Long id) {
        String userId = SecurityUtils.getCurrentUserId();
        SearchHistory history = searchHistoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION));

        if (!history.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        searchHistoryRepository.delete(history);
    }

    @Override
    @Transactional
    public void clearAllSearchHistory() {
        String userId = SecurityUtils.getCurrentUserId();
        searchHistoryRepository.deleteAllByUserId(userId);
    }
}
