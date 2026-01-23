package com.zola.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Role {
    @Id
    @Column(name = "name", unique = true, columnDefinition = "VARCHAR(255)")
    String name;

    @Column(name = "role_name")
    String roleName;

    @Column(name = "description")
    String description;
}
