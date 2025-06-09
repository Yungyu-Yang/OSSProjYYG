package com.skycastle.mindtune.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_ava_table")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAvaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uano;

    @Column(name = "uno")
    private Long uno;

    @Column(name = "ano")
    private Long ano;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
