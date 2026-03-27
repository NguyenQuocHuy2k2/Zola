package com.zola.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "document_hash")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentHash {

    @Id
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "hash_value", nullable = false, length = 255)
    private String hashValue;
}
