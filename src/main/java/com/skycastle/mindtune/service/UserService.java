package com.skycastle.mindtune.service;

import com.skycastle.mindtune.dto.*;
import com.skycastle.mindtune.entity.UserAvaEntity;
import com.skycastle.mindtune.entity.UserAvaLockEntity;
import com.skycastle.mindtune.entity.UserEntity;
import com.skycastle.mindtune.entity.AvaEntity;
import com.skycastle.mindtune.repository.AvaRepository;
import com.skycastle.mindtune.repository.UserAvaRepository;
import com.skycastle.mindtune.repository.UserRepository;
import com.skycastle.mindtune.repository.UserAvaLockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserAvaLockRepository userAvaLockRepository;
    private final UserAvaRepository userAvaRepository;
    private final AvaRepository avaRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public Long signup(UserSignupRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        UserEntity user = UserEntity.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .status(1)
                .attend(1)
                .lastAttendDate(LocalDate.now())
                .createdAt(LocalDateTime.now())
                .build();

        user = userRepository.save(user);
        Long uno = user.getUno();

        for (long ano = 1; ano <= 10; ano++) {
            int status = (ano == 1 || ano == 2) ? 1 : 0;

            UserAvaLockEntity lock = UserAvaLockEntity.builder()
                    .uno(uno)
                    .ano(ano)
                    .status(status)
                    .updatedAt(LocalDateTime.now())
                    .build();

            userAvaLockRepository.save(lock);
        }

        UserAvaEntity userAva = UserAvaEntity.builder()
                .uno(uno)
                .ano(1L)
                .updatedAt(LocalDateTime.now())
                .build();

        userAvaRepository.save(userAva);

        return uno;
    }

    public boolean isEmailDuplicate(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean isNameDuplicate(String name) {
        return userRepository.existsByName(name);
    }

    public Long login(UserLoginRequestDTO request) {
        UserEntity user = userRepository.findByEmail(request.getEmail());

        if(user == null) {
            throw new IllegalArgumentException("회원이 존재하지 않습니다.");
        }

        if(user.getStatus() == 0){
            throw new IllegalArgumentException("탈퇴한 회원입니다.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        LocalDate today = LocalDate.now();
        if (user.getLastAttendDate() == null || !user.getLastAttendDate().isEqual(today)) {
            user.setAttend(user.getAttend() + 1);
            user.setLastAttendDate(today);
            userRepository.save(user);
        }

        return user.getUno();
    }

    public UserMypageResponseDTO getMypage(Long uno) {

        UserEntity userEntity = userRepository.findById(uno)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        UserAvaEntity userAvaEntity = userAvaRepository.findByUno(uno);

        String imgUrl = avaRepository.findByAno(userAvaEntity.getAno())
                .map(AvaEntity::getImg)
                .orElse(null);

        return new UserMypageResponseDTO(
                userEntity.getUno(),
                userEntity.getName(),
                userEntity.getEmail(),
                userAvaEntity.getAno(),
                imgUrl,
                userEntity.getAttend()
        );
    }

    public UserHomeRequestDTO getHome(Long uno) {

        UserEntity userEntity = userRepository.findById(uno)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        UserAvaEntity userAvaEntity = userAvaRepository.findByUno(uno);

        String imgUrl = avaRepository.findByAno(userAvaEntity.getAno())
                .map(AvaEntity::getImg)
                .orElse(null);

        return new UserHomeRequestDTO(
                userEntity.getUno(),
                userAvaEntity.getAno(),
                imgUrl
        );
    }

    public UserInfoResponseDTO getUserInfo(Long uno) {

        UserEntity userEntity = userRepository.findById(uno)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        return new UserInfoResponseDTO(
                userEntity.getUno(),
                userEntity.getName(),
                userEntity.getEmail()
        );
    }

    public UserChangeInfoResponseDTO updateUserInfo(Long uno, UserChangeInfoRequestDTO request) {
        UserEntity user = userRepository.findById(uno)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);

        return new UserChangeInfoResponseDTO(user.getName(), user.getEmail());
    }

    public void withdrawUser(Long uno) {
        UserEntity userEntity = userRepository.findById(uno)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        userEntity.setStatus(0);
        userRepository.save(userEntity);
    }

}