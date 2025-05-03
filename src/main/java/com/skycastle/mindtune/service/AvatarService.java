package com.skycastle.mindtune.service;

import com.skycastle.mindtune.dto.AvatarLockInfoResponseDTO;
import com.skycastle.mindtune.dto.AvatarSelectInfoResponseDTO;
import com.skycastle.mindtune.dto.AvatarSelectChangeRequestDTO;
import com.skycastle.mindtune.entity.AvaEntity;
import com.skycastle.mindtune.entity.UserAvaEntity;
import com.skycastle.mindtune.entity.UserAvaLockEntity;
import com.skycastle.mindtune.repository.AvaRepository;
import com.skycastle.mindtune.repository.UserAvaLockRepository;
import com.skycastle.mindtune.repository.UserAvaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvatarService {
    private final UserAvaLockRepository userAvaLockRepository;
    private final UserAvaRepository userAvaRepository;
    private final AvaRepository avaRepository;

    public List<AvatarLockInfoResponseDTO> getAvatarLockInfo(Long uno) {
        // user_ava_lock_table에서 uno로 해당 유저의 모든 아바타 잠금 상태 조회
        List<UserAvaLockEntity> lockEntities = userAvaLockRepository.findByUno(uno);
        return lockEntities.stream().map(lock -> {
            // ava_table에서 ano로 img(이미지 경로) 조회
            Optional<AvaEntity> avaOpt = avaRepository.findByAno(lock.getAno());
            String img = avaOpt.map(AvaEntity::getImg).orElse("");
            return AvatarLockInfoResponseDTO.builder()
                    .uno(lock.getUno())
                    .ano(lock.getAno())
                    .anoImg(img)
                    .status(lock.getStatus())
                    .build();
        }).collect(Collectors.toList());
    }

    public AvatarSelectInfoResponseDTO getAvatarSelectInfo(Long uno) {
        UserAvaEntity userAva = userAvaRepository.findByUno(uno);
        if (userAva == null) throw new IllegalArgumentException("아바타 선택 정보가 없습니다.");
        return AvatarSelectInfoResponseDTO.builder()
                .uno(userAva.getUno())
                .ano(userAva.getAno())
                .build();
    }

    public AvatarSelectInfoResponseDTO changeAvatar(Long uno, AvatarSelectChangeRequestDTO request) {
        UserAvaEntity userAva = userAvaRepository.findByUno(uno);
        if (userAva == null) throw new IllegalArgumentException("아바타 선택 정보가 없습니다.");
        userAva.setAno(request.getAno());
        userAvaRepository.save(userAva);
        return AvatarSelectInfoResponseDTO.builder()
                .uno(userAva.getUno())
                .ano(userAva.getAno())
                .build();
    }
} 