package com.skycastle.mindtune.repository;

import com.skycastle.mindtune.entity.NoteIconEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NoteIconRepository extends JpaRepository<NoteIconEntity, Long> {
    Optional<NoteIconEntity> findByName(String name);
} 