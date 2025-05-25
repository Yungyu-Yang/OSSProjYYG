package com.skycastle.mindtune.controller;

import com.skycastle.mindtune.auth.JwtTokenProvider;
import com.skycastle.mindtune.dto.ChatHistoryResponseDTO;
import com.skycastle.mindtune.dto.ChatResponseDTO;
import com.skycastle.mindtune.dto.ChatSaveRequestDTO;
import com.skycastle.mindtune.dto.VoiceChatSaveRequestDTO;
import com.skycastle.mindtune.reponse.BaseResponse;
import com.skycastle.mindtune.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/text")
    public ResponseEntity<?> saveTextChat(
            @RequestHeader("Authorization") String token,
            @RequestBody ChatSaveRequestDTO request) {

        String jwtToken = token.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }

        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        ChatResponseDTO chat = chatService.saveChat(uno, request);

        Map<String, Object> body = new HashMap<>();
        body.put("chat", chat.getChat());
        body.put("isbot", chat.getIsbot());
        body.put("created_at", chat.getCreatedAt());

        BaseResponse<Map<String, Object>> response = new BaseResponse<>(1000, "채팅이 성공적으로 저장되었습니다.", body);
        return ResponseEntity.ok(response);
    }

//    @PostMapping("/voice")
//    public ResponseEntity<?> saveVoiceChat(
//            @RequestHeader("Authorization") String token,
//            @RequestBody VoiceChatSaveRequestDTO request) {
//
//        String jwtToken = token.replace("Bearer ", "");
//        if (!jwtTokenProvider.validateToken(jwtToken)) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
//        }
//
//        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//
//        ChatResponseDTO chat = chatService.saveVoiceChat(uno, request);
//
//        Map<String, Object> body = new HashMap<>();
//        body.put("chat", chat.getChat());
//        body.put("isbot", chat.getIsbot());
//        body.put("created_at", chat.getCreated_at());
//        body.put("audio_url", chat.getAudioUrl());
//
//        BaseResponse<Map<String, Object>> response = new BaseResponse<>(1000, "음성 채팅이 성공적으로 저장되었습니다.", body);
//        return ResponseEntity.ok(response);
//    }

    @PostMapping("/voice")
    public ResponseEntity<?> saveVoiceChat(
            @RequestHeader("Authorization") String token,
            @RequestParam("voice") MultipartFile voiceFile) {

        String jwtToken = token.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }

        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 1. 임시 파일 저장
        Path tempFile = null;
        try {
            tempFile = Files.createTempFile("voice_", ".mp3");
            Files.write(tempFile, voiceFile.getBytes());
            VoiceChatSaveRequestDTO request = new VoiceChatSaveRequestDTO(tempFile.toString());

            // 2. 서비스에 임시 파일 경로 전달
            ChatResponseDTO chat = chatService.saveVoiceChat(uno, request);

            // 3. 응답 구성
            Map<String, Object> body = new HashMap<>();
            body.put("userChat", chat.getUserChat());
            body.put("userIsbot", chat.getUserIsbot());
            body.put("userCreated_at", chat.getUserCreatedAt());
            body.put("chat", chat.getChat());
            body.put("isbot", chat.getIsbot());
            body.put("created_at", chat.getCreatedAt());
            body.put("audio_url", chat.getAudioUrl());

            BaseResponse<Map<String, Object>> response = new BaseResponse<>(1000, "음성 채팅이 성공적으로 저장되었습니다.", body);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            throw new RuntimeException("임시 파일 저장 실패", e);
        } finally {
            // 4. 임시 파일 삭제
            if (tempFile != null) {
                try {
                    Files.deleteIfExists(tempFile);
                } catch (IOException ignored) {}
            }
        }
    }

    @GetMapping
    public ResponseEntity<?> getChatHistory(
            @RequestHeader("Authorization") String token,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        String jwtToken = token.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }

        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        ChatHistoryResponseDTO history = chatService.getChatHistory(uno, date);

        Map<String, Object> body = new HashMap<>();
        body.put("uno", history.getUno());
        body.put("ano", history.getAno());
        body.put("anoName", history.getAvaName());
        body.put("anoImg", history.getAnoImg());
        body.put("chats", history.getChats());

        BaseResponse<Map<String, Object>> response = new BaseResponse<>(1000, "채팅 내역 조회에 성공했습니다.", body);
        return ResponseEntity.ok(response);
    }

}
