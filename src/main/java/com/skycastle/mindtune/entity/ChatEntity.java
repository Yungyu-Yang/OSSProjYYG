package com.skycastle.mindtune.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_table")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ChatEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uno")
    private UserEntity userEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eno")
    private EmotionEntity emotionEntity;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String chat;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_bot", nullable = false)
    private int isBot;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
