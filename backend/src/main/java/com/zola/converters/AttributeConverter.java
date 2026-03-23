package com.zola.converters;

import com.zola.dto.response.attribute.ColorResponse;
import com.zola.dto.response.attribute.SizeResponse;
import com.zola.entity.Color;
import com.zola.entity.Size;
import org.springframework.stereotype.Component;

@Component
public class AttributeConverter {

    public ColorResponse toColorResponse(Color color) {
        if (color == null) {
            return null;
        }
        return ColorResponse.builder()
                .id(color.getId())
                .name(color.getName())
                .hexCode(color.getHexCode())
                .build();
    }

    public SizeResponse toSizeResponse(Size size) {
        if (size == null) {
            return null;
        }
        return SizeResponse.builder()
                .id(size.getId())
                .name(size.getName())
                .build();
    }
}
