package com.zola.repository;

import com.zola.entity.DocumentHash;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentHashRepository extends JpaRepository<DocumentHash, String> {
}
