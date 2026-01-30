package com.zola.services.search;

import com.zola.dto.response.search.SearchHistoryResponse;

import java.util.List;

public interface SearchHistoryService {
    void saveKeyword(String keyword);
    List<SearchHistoryResponse> getRecentSearches(int limit);
    void deleteSearchHistory(Long id);
    void clearAllSearchHistory();
}
