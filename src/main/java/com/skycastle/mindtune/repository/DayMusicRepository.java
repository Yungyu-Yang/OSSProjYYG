package com.skycastle.mindtune.repository;

import com.skycastle.mindtune.entity.DayMusicEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface DayMusicRepository extends JpaRepository<DayMusicEntity, Long> {
    List<DayMusicEntity> findByUnoAndCreatedAtBetween(Long uno, LocalDateTime start, LocalDateTime end);
} 