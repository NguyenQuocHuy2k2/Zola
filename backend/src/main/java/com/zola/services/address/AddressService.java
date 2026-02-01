package com.zola.services.address;

import com.zola.dto.request.profile.AddressRequest;
import com.zola.dto.response.address.AddressResponse;

import java.util.List;

public interface AddressService {
    List<AddressResponse> getMyAddresses();
    AddressResponse addAddress(AddressRequest request);
    AddressResponse updateAddress(String id, AddressRequest request);
    void deleteAddress(String id);
    AddressResponse setDefault(String id);
}
