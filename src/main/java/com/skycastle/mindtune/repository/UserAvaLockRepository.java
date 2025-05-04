package com.skycastle.mindtune.repository;

import com.skycastle.mindtune.entity.UserAvaLockEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAvaLockRepository extends JpaRepository<UserAvaLockEntity, Long> {
    List<UserAvaLockEntity> findByUno(Long uno);
    UserAvaLockEntity findByUnoAndAno(Long uno, Long ano);
}
// user_ava_lock_table에서 uno로 해당 유저의 모든 아바타 잠금 상태를 효율적으로 조회
