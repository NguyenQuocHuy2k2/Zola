package com.zola.repository;

import com.zola.entity.Notification;
import com.zola.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findAllByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    long countByUserAndReadFalse(User user);
    
    List<Notification> findAllByUserAndReadFalse(User user);
}
