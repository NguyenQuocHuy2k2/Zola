package com.zola.services.address;

import com.zola.dto.request.profile.AddressRequest;
import com.zola.dto.response.address.AddressResponse;
import com.zola.entity.Address;
import com.zola.entity.User;
import com.zola.exception.AppException;
import com.zola.exception.ErrorCode;
import com.zola.repository.AddressRepository;
import com.zola.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import com.zola.utils.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressServiceImpl implements AddressService {

    AddressRepository addressRepository;
    UserRepository userRepository;

    private User getCurrentUser() {
        String userId = SecurityUtils.getCurrentUserId();
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private AddressResponse toResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .province(address.getProvince())
                .district(address.getDistrict())
                .ward(address.getWard())
                .streetAddress(address.getStreetAddress())
                .isDefault(address.getIsDefault())
                .createdAt(address.getCreatedAt())
                .build();
    }

    @Override
    public List<AddressResponse> getMyAddresses() {
        User user = getCurrentUser();
        return addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressResponse addAddress(AddressRequest request) {
        User user = getCurrentUser();

        // If this is marked as default, unset existing default
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.findByUserAndIsDefaultTrue(user)
                    .ifPresent(existing -> {
                        existing.setIsDefault(false);
                        addressRepository.save(existing);
                    });
        }

        // If no addresses exist, force this one to be default
        boolean hasAddresses = !addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user).isEmpty();

        Address address = Address.builder()
                .user(user)
                .province(request.getProvince())
                .district(request.getDistrict())
                .ward(request.getWard())
                .streetAddress(request.getStreetAddress())
                .isDefault(!hasAddresses || Boolean.TRUE.equals(request.getIsDefault()))
                .build();

        return toResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(String id, AddressRequest request) {
        User user = getCurrentUser();
        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        // If setting as default, unset the old one
        if (Boolean.TRUE.equals(request.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            addressRepository.findByUserAndIsDefaultTrue(user)
                    .ifPresent(existing -> {
                        existing.setIsDefault(false);
                        addressRepository.save(existing);
                    });
        }

        address.setProvince(request.getProvince());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setStreetAddress(request.getStreetAddress());
        address.setIsDefault(request.getIsDefault());

        return toResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public void deleteAddress(String id) {
        User user = getCurrentUser();
        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());
        addressRepository.delete(address);

        // Promote the first remaining address to default
        if (wasDefault) {
            addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user)
                    .stream()
                    .findFirst()
                    .ifPresent(next -> {
                        next.setIsDefault(true);
                        addressRepository.save(next);
                    });
        }
    }

    @Override
    @Transactional
    public AddressResponse setDefault(String id) {
        User user = getCurrentUser();
        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        // Unset current default
        addressRepository.findByUserAndIsDefaultTrue(user)
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        existing.setIsDefault(false);
                        addressRepository.save(existing);
                    }
                });

        address.setIsDefault(true);
        return toResponse(addressRepository.save(address));
    }
}
