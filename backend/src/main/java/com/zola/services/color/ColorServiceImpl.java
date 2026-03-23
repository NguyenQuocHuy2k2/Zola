package com.zola.services.color;

import com.zola.converters.AttributeConverter;
import com.zola.dto.request.attribute.ColorRequest;
import com.zola.dto.response.attribute.ColorResponse;
import com.zola.entity.Color;
import com.zola.repository.ColorRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ColorServiceImpl implements ColorService {

    ColorRepository colorRepository;
    AttributeConverter attributeConverter;

    @Override
    public ColorResponse createColor(ColorRequest request) {
        Color color = Color.builder()
                .name(request.getName())
                .hexCode(request.getHexCode())
                .build();
        color = colorRepository.save(color);
        return attributeConverter.toColorResponse(color);
    }

    @Override
    public List<ColorResponse> getAllColors() {
        return colorRepository.findAll().stream()
                .map(attributeConverter::toColorResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ColorResponse getColor(Long id) {
        Color color = colorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Color not found"));
        return attributeConverter.toColorResponse(color);
    }

    @Override
    public ColorResponse updateColor(Long id, ColorRequest request) {
        Color color = colorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Color not found"));
        color.setName(request.getName());
        color.setHexCode(request.getHexCode());
        color = colorRepository.save(color);
        return attributeConverter.toColorResponse(color);
    }

    @Override
    public void deleteColor(Long id) {
        colorRepository.deleteById(id);
    }
}
