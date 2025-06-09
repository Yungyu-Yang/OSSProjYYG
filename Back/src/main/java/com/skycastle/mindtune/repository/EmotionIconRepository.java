package com.skycastle.mindtune.repository;

import com.skycastle.mindtune.entity.EmotionIconEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmotionIconRepository extends JpaRepository<EmotionIconEntity, Long> {
    Optional<EmotionIconEntity> findByAnoAndEno(Long ano, Long eno);
} 