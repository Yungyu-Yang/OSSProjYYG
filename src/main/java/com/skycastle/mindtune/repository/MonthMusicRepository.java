package com.skycastle.mindtune.repository;

import com.skycastle.mindtune.entity.MonthMusicEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface MonthMusicRepository extends JpaRepository<MonthMusicEntity, Long> {
    List<MonthMusicEntity> findByUnoAndCreatedAtBetween(Long uno, LocalDateTime start, LocalDateTime end);
} 