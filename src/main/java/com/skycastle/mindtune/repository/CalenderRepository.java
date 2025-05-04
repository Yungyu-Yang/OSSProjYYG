package com.skycastle.mindtune.repository;

import com.skycastle.mindtune.entity.CalenderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CalenderRepository extends JpaRepository<CalenderEntity, Long> {
    List<CalenderEntity> findByUno(Long uno);
    List<CalenderEntity> findByUnoAndCreatedAtBetween(Long uno, java.time.LocalDateTime start, java.time.LocalDateTime end);
} 