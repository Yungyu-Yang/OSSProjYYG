package com.skycastle.mindtune.repository;

import com.skycastle.mindtune.entity.DayMusicEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface DayMusicRepository extends JpaRepository<DayMusicEntity, Long> {
    List<DayMusicEntity> findByUnoAndCreatedAtBetween(Long uno, LocalDateTime start, LocalDateTime end);
//    List<DayMusicEntity> findByUnoAndCreatedAtOrderByCreatedAtDesc(Long uno, LocalDate createdAt);
    @Query("SELECT d FROM DayMusicEntity d WHERE d.uno = :uno AND d.createdAt BETWEEN :start AND :end ORDER BY d.createdAt DESC")
    List<DayMusicEntity> findByUnoAndCreatedAtBetweenOrderByCreatedAtDesc(
            @Param("uno") Long uno,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

}