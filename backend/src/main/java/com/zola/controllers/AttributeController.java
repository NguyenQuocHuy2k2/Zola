package com.zola.controllers;

import com.zola.dto.request.attribute.SizeRequest;
import com.zola.dto.request.attribute.ColorRequest;
import com.zola.dto.response.ApiResponse;
import com.zola.dto.response.attribute.SizeResponse;
import com.zola.dto.response.attribute.ColorResponse;
import com.zola.services.size.SizeService;
import com.zola.services.color.ColorService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attributes")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AttributeController {

    SizeService sizeService;
    ColorService colorService;

    // --- SIZES ---
    @GetMapping("/sizes")
    public ApiResponse<List<SizeResponse>> getAllSizes() {
        return ApiResponse.<List<SizeResponse>>builder()
                .result(sizeService.getAllSizes())
                .build();
    }

    @PostMapping("/sizes")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<SizeResponse> createSize(@RequestBody @Valid SizeRequest request) {
        return ApiResponse.<SizeResponse>builder()
                .result(sizeService.createSize(request))
                .build();
    }

    @PutMapping("/sizes/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<SizeResponse> updateSize(@PathVariable Long id, @RequestBody @Valid SizeRequest request) {
        return ApiResponse.<SizeResponse>builder()
                .result(sizeService.updateSize(id, request))
                .build();
    }

    @DeleteMapping("/sizes/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<String> deleteSize(@PathVariable Long id) {
        sizeService.deleteSize(id);
        return ApiResponse.<String>builder()
                .result("Size deleted")
                .build();
    }

    // --- COLORS ---
    @GetMapping("/colors")
    public ApiResponse<List<ColorResponse>> getAllColors() {
        return ApiResponse.<List<ColorResponse>>builder()
                .result(colorService.getAllColors())
                .build();
    }

    @PostMapping("/colors")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<ColorResponse> createColor(@RequestBody @Valid ColorRequest request) {
        return ApiResponse.<ColorResponse>builder()
                .result(colorService.createColor(request))
                .build();
    }

    @PutMapping("/colors/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<ColorResponse> updateColor(@PathVariable Long id, @RequestBody @Valid ColorRequest request) {
        return ApiResponse.<ColorResponse>builder()
                .result(colorService.updateColor(id, request))
                .build();
    }

    @DeleteMapping("/colors/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<String> deleteColor(@PathVariable Long id) {
        colorService.deleteColor(id);
        return ApiResponse.<String>builder()
                .result("Color deleted")
                .build();
    }
}
