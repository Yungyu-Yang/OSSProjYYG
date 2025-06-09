package com.skycastle.mindtune.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "note_icon_table")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteIconEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nino;

    @Column(name = "name", length = 10)
    private String name;

    @Column(name = "img")
    private String img;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
} 