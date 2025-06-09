package com.skycastle.mindtune.repository;

import com.skycastle.mindtune.entity.AvaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AvaRepository extends JpaRepository<AvaEntity, Long> {
    Optional<AvaEntity> findByAno(Long ano);
}
