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

    @Column(name = "uno")
    private Long uno;

    @Column(name = "prompt")
    private String prompt;

    @Column(name = "music")
    private String music;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
} 