package com.skycastle.mindtune.repository;

import com.skycastle.mindtune.entity.ChatEntity;
import com.skycastle.mindtune.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
//import java.util.Optional;

public interface ChatRepository extends JpaRepository<ChatEntity, Long> {

//  List<ChatEntity> findByUserEntityAndIsBot(UserEntity userEntity, int isBot);
//  특정 사용자에 대해 isBot이 주어진 값인 채팅만 조회(사용자가 보낸 채팅만 조회할 때 사용)

//  Optional<ChatEntity> findFirstByUserEntityAndIsBotOrderByCreatedAtDesc(UserEntity userEntity, int isBot);
//  특정 사용자에 대해 최신 GPT 응답 조회(사용자의 채팅에 GPT가 응답할 때 사용)

    List<ChatEntity> findByUserEntityAndCreatedAtBetweenOrderByCreatedAtAsc(UserEntity user, LocalDateTime start, LocalDateTime end);
//  특정 사용자의 채팅,날짜 범위(하루치),오래된 순 정렬

    List<ChatEntity> findByUserEntity_UnoAndCreatedAtBetween(Long uno, LocalDateTime start, LocalDateTime end);

}
