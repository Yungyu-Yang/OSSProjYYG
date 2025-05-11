package com.skycastle.mindtune.repository;

import com.skycastle.mindtune.entity.EmotionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmotionRepository extends JpaRepository<EmotionEntity, Long> {
    Optional<EmotionEntity> findByEmotion(String emotion);
}