package com.zola.repository;

import com.zola.entity.ChatMessageAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageAttachmentRepository extends JpaRepository<ChatMessageAttachment, String> {
    List<ChatMessageAttachment> findAllByMessageId(String messageId);
}
