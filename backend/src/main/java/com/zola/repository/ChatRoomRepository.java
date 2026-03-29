package com.zola.repository;

import com.zola.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
    Optional<ChatRoom> findFirstByShopIdAndUserIdOrderByCreatedAtAsc(String shopId, String userId);
    List<ChatRoom> findAllByShopIdOrderByCreatedAtDesc(String shopId);
    List<ChatRoom> findAllByUserIdOrderByCreatedAtDesc(String userId);
}
