package com.zola.services.size;

import com.zola.converters.AttributeConverter;
import com.zola.dto.request.attribute.SizeRequest;
import com.zola.dto.response.attribute.SizeResponse;
import com.zola.entity.Size;
import com.zola.repository.SizeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SizeServiceImpl implements SizeService {

    SizeRepository sizeRepository;
    AttributeConverter attributeConverter;

    @Override
    public SizeResponse createSize(SizeRequest request) {
        Size size = Size.builder()
                .name(request.getName())
                .build();
        size = sizeRepository.save(size);
        return attributeConverter.toSizeResponse(size);
    }

    @Override
    public List<SizeResponse> getAllSizes() {
        return sizeRepository.findAll().stream()
                .map(attributeConverter::toSizeResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SizeResponse getSize(Long id) {
        Size size = sizeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Size not found"));
        return attributeConverter.toSizeResponse(size);
    }

    @Override
    public SizeResponse updateSize(Long id, SizeRequest request) {
        Size size = sizeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Size not found"));
        size.setName(request.getName());
        size = sizeRepository.save(size);
        return attributeConverter.toSizeResponse(size);
    }

    @Override
    public void deleteSize(Long id) {
        sizeRepository.deleteById(id);
    }
}
