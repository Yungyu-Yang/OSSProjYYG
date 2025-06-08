package com.skycastle.mindtune.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "calender_table")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalenderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cdno;

    @Column(name = "uno")
    private Long uno;

    @Column(name = "eino")
    private Long eino;

    @Column(name = "nino")
    private Long nino;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
} 