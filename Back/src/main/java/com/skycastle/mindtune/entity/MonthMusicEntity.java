package com.skycastle.mindtune.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "month_music_table")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthMusicEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mmno;

    @Column(name = "uno")
    private Long uno;

    @Column(name = "prompt")
    private String prompt;

    @Column(name = "music")
    private String music;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
} 