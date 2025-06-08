package com.skycastle.mindtune.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "day_music_table")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DayMusicEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dmno;

    private Long uno;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String prompt;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String music;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
} 