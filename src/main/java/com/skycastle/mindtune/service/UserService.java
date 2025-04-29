package com.skycastle.mindtune.service;

import com.skycastle.mindtune.auth.JwtTokenProvider;
import com.skycastle.mindtune.dto.UserLoginRequestDTO;
import com.skycastle.mindtune.dto.UserSignupRequestDTO;
import com.skycastle.mindtune.entity.UserEntity;
import com.skycastle.mindtune.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
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
                .createdAt(LocalDateTime.now())
                .build();

        return userRepository.save(user).getUno();
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

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return user.getUno();
    }
}