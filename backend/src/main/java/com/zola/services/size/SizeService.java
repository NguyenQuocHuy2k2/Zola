package com.zola.services.size;

import com.zola.dto.request.attribute.SizeRequest;
import com.zola.dto.response.attribute.SizeResponse;

import java.util.List;

public interface SizeService {
    SizeResponse createSize(SizeRequest request);
    List<SizeResponse> getAllSizes();
    SizeResponse getSize(Long id);
    SizeResponse updateSize(Long id, SizeRequest request);
    void deleteSize(Long id);
}
