package com.skycastle.mindtune.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ava_table")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ano;

    @Column(name = "name", nullable = false, length = 20)
    private String name;

    @Column(name = "img", nullable = false)
    private String img;

    @Column(name = "personality", nullable = false)
    private String personality;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
