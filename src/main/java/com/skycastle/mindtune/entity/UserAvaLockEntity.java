package com.skycastle.mindtune.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_ava_lock_table")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAvaLockEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ualno;

    @Column(name = "uno")
    private Long uno;

    @Column(name = "ano")
    private Long ano;

    @Column(name = "status", nullable = false)
    private int status;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
