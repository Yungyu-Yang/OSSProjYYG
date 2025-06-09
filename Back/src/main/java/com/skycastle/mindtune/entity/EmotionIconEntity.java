package com.skycastle.mindtune.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "emotion_icon_table")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmotionIconEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eino;

    @Column(name = "ano")
    private Long ano;

    @Column(name = "eno")
    private Long eno;

    @Column(name = "img")
    private String img;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
} 