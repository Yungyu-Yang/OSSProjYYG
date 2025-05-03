package com.skycastle.mindtune.controller;

import com.skycastle.mindtune.auth.JwtTokenProvider;
import com.skycastle.mindtune.dto.AvatarLockInfoResponseDTO;
import com.skycastle.mindtune.dto.AvatarSelectInfoResponseDTO;
import com.skycastle.mindtune.dto.AvatarSelectChangeRequestDTO;
import com.skycastle.mindtune.reponse.BaseResponse;
import com.skycastle.mindtune.service.AvatarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/avatar")
@RequiredArgsConstructor
public class AvatarController {
    private final AvatarService avatarService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/lock")
    public ResponseEntity<?> getAvatarLockInfo(@RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }
        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<AvatarLockInfoResponseDTO> lockInfo = avatarService.getAvatarLockInfo(uno);
        BaseResponse<List<AvatarLockInfoResponseDTO>> response = new BaseResponse<>(1000, "아바타 잠금 정보 조회에 성공하였습니다.", lockInfo);
        return ResponseEntity.ok(response);
    }

    @GetMapping("")
    public ResponseEntity<?> getAvatarSelectInfo(@RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }
        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AvatarSelectInfoResponseDTO selectInfo = avatarService.getAvatarSelectInfo(uno);
        BaseResponse<AvatarSelectInfoResponseDTO> response = new BaseResponse<>(1000, "아바타 선택 정보 조회에 성공하였습니다.", selectInfo);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/change")
    public ResponseEntity<?> changeAvatar(@RequestHeader("Authorization") String token, @RequestBody AvatarSelectChangeRequestDTO request) {
        String jwtToken = token.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }
        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AvatarSelectInfoResponseDTO result = avatarService.changeAvatar(uno, request);
        BaseResponse<AvatarSelectInfoResponseDTO> response = new BaseResponse<>(1000, "아바타가 성공적으로 변경되었습니다.", result);
        return ResponseEntity.ok(response);
    }
} 