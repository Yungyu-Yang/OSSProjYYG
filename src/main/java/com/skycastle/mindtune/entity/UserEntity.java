package com.skycastle.mindtune.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_table")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uno;

    @Column(nullable = false, length = 20)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false)
    private int status;

    private Integer attend;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "inactive_date")
    private LocalDateTime inactiveDate;
}