package com.zola.controllers;

import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.search.SearchHistoryResponse;
import com.zola.services.search.SearchHistoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/search-history")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SearchHistoryController {

    SearchHistoryService searchHistoryService;

    @GetMapping
    public ApiResponse<List<SearchHistoryResponse>> getRecentSearches(
            @RequestParam(defaultValue = "10") int limit) {
        return ApiResponse.<List<SearchHistoryResponse>>builder()
                .result(searchHistoryService.getRecentSearches(limit))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteSearchHistory(@PathVariable Long id) {
        searchHistoryService.deleteSearchHistory(id);
        return ApiResponse.<Void>builder()
                .message("Deleted successfully")
                .build();
    }

    @DeleteMapping
    public ApiResponse<Void> clearAllSearchHistory() {
        searchHistoryService.clearAllSearchHistory();
        return ApiResponse.<Void>builder()
                .message("Cleared all successfully")
                .build();
    }
}
