package com.zola.repository;

import com.zola.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {
    Page<ChatMessage> findAllByRoomIdOrderByTimestampDesc(String roomId, Pageable pageable);
    List<ChatMessage> findAllByRoomIdOrderByTimestampAsc(String roomId);
    long countByRoomIdAndIsReadFalseAndSenderIdNot(String roomId, String senderId);
    Optional<ChatMessage> findFirstByRoomIdOrderByTimestampDesc(String roomId);
}
