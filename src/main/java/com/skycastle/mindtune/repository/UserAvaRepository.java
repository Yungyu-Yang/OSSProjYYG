package com.skycastle.mindtune.repository;

import com.skycastle.mindtune.entity.UserAvaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAvaRepository  extends JpaRepository<UserAvaEntity, Long> {
    UserAvaEntity findByUno(Long uno);
}
