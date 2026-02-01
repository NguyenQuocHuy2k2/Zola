package com.zola.services.color;

import com.zola.dto.request.attribute.ColorRequest;
import com.zola.dto.response.attribute.ColorResponse;

import java.util.List;

public interface ColorService {
    ColorResponse createColor(ColorRequest request);
    List<ColorResponse> getAllColors();
    ColorResponse getColor(Long id);
    ColorResponse updateColor(Long id, ColorRequest request);
    void deleteColor(Long id);
}
