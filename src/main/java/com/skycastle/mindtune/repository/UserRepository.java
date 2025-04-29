package com.skycastle.mindtune.repository;

import com.skycastle.mindtune.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByEmail(String email);
    boolean existsByName(String name);
    UserEntity findByEmail(String email);
}