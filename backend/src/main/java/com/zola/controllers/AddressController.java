package com.zola.controllers;

import com.zola.dto.request.profile.AddressRequest;
import com.zola.dto.response.address.AddressResponse;
import com.zola.dto.response.ApiResponse;
import com.zola.services.address.AddressService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("addresses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressController {

    AddressService addressService;

    @GetMapping
    public ApiResponse<List<AddressResponse>> getMyAddresses() {
        return ApiResponse.<List<AddressResponse>>builder()
                .result(addressService.getMyAddresses())
                .build();
    }

    @PostMapping
    public ApiResponse<AddressResponse> addAddress(@RequestBody @Valid AddressRequest request) {
        return ApiResponse.<AddressResponse>builder()
                .result(addressService.addAddress(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<AddressResponse> updateAddress(
            @PathVariable String id,
            @RequestBody @Valid AddressRequest request) {
        return ApiResponse.<AddressResponse>builder()
                .result(addressService.updateAddress(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAddress(@PathVariable String id) {
        addressService.deleteAddress(id);
        return ApiResponse.<Void>builder()
                .message("Address deleted successfully")
                .build();
    }

    @PatchMapping("/{id}/set-default")
    public ApiResponse<AddressResponse> setDefault(@PathVariable String id) {
        return ApiResponse.<AddressResponse>builder()
                .result(addressService.setDefault(id))
                .build();
    }
}
