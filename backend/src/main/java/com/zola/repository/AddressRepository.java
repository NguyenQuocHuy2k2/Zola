package com.zola.repository;

import com.zola.entity.Address;
import com.zola.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, String> {
    List<Address> findByUserOrderByIsDefaultDescCreatedAtDesc(User user);
    Optional<Address> findByIdAndUser(String id, User user);
    Optional<Address> findByUserAndIsDefaultTrue(User user);
}
