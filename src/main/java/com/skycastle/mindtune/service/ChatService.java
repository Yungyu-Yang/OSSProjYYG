package com.skycastle.mindtune.service;

import com.skycastle.mindtune.dto.*;
import com.skycastle.mindtune.entity.AvaEntity;
import com.skycastle.mindtune.entity.ChatEntity;
import com.skycastle.mindtune.entity.UserAvaEntity;
import com.skycastle.mindtune.entity.UserEntity;
import com.skycastle.mindtune.repository.AvaRepository;
import com.skycastle.mindtune.repository.ChatRepository;
import com.skycastle.mindtune.repository.UserAvaRepository;
import com.skycastle.mindtune.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
//import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final UserAvaRepository userAvaRepository;
    private final AvaRepository avaRepository;

    //채팅 저장, 응답 생성
    public ChatResponseDTO saveChat(Long uno, ChatSaveRequestDTO request) {
        UserEntity user = getUserOrThrow(uno);

        ChatEntity userChat = ChatEntity.builder()
                .userEntity(user)
                .chat(request.getMessage())
                .isBot(0)
                .createdAt(LocalDateTime.now())
                .build();
        chatRepository.save(userChat);

        String gptReply = generateGPTResponse(request.getMessage());

        ChatEntity botChat = ChatEntity.builder()
                .userEntity(user)
                .chat(gptReply)
                .isBot(1)
                .createdAt(LocalDateTime.now())
                .build();
        chatRepository.save(botChat);

        return ChatResponseDTO.builder()
                .chat(botChat.getChat())
                .isbot(botChat.getIsBot())
                .created_at(botChat.getCreatedAt())
                .build();
    }

    //음성 채팅 저장, 응답 생성
    public ChatResponseDTO saveVoiceChat(Long uno, VoiceChatSaveRequestDTO request) {
        UserEntity user = getUserOrThrow(uno);

        ChatEntity userChat = ChatEntity.builder()
                .userEntity(user)
                .chat(request.getVoiceurl()) // mp3 URL 자체를 저장
                .isBot(0)
                .createdAt(LocalDateTime.now())
                .build();
        chatRepository.save(userChat);

        String gptReply = generateGPTVoiceResponse(request.getVoiceurl());

        ChatEntity botChat = ChatEntity.builder()
                .userEntity(user)
                .chat(gptReply)
                .isBot(1)
                .createdAt(LocalDateTime.now())
                .build();
        chatRepository.save(botChat);

        return ChatResponseDTO.builder()
                .chat(botChat.getChat())
                .isbot(botChat.getIsBot())
                .created_at(botChat.getCreatedAt())
                .build();
    }

    public ChatHistoryResponseDTO getChatHistory(Long uno, LocalDate date) {

        UserEntity user = getUserOrThrow(uno);

        UserAvaEntity userAva = userAvaRepository.findByUno(uno);
        if (userAva == null) {
            throw new IllegalArgumentException("사용자의 아바타 정보가 없습니다.");
        }
        Long ano = userAva.getAno();

        String imgUrl = avaRepository.findByAno(ano)
                .map(AvaEntity::getImg)
                .orElseThrow(() -> new IllegalArgumentException("아바타 이미지가 존재하지 않습니다."));


        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        List<ChatEntity> chatEntities = chatRepository.findByUserEntityAndCreatedAtBetweenOrderByCreatedAtAsc(user, start, end);


        List<ChatLogDTO> chats = chatEntities.stream()
                .map(chat -> ChatLogDTO.builder()
                        .chat(chat.getChat())
                        .isbot(chat.getIsBot())
                        .created_at(chat.getCreatedAt())
                        .build())
                .toList();

        return ChatHistoryResponseDTO.builder()
                .uno(user.getUno())
                .ano(ano)
                .anoImg(imgUrl)
                .chats(chats)
                .build();
    }

    private String generateGPTResponse(String userMessage) {
        try {
            ProcessBuilder pb = new ProcessBuilder("python3", "src/main/java/com/skycastle/mindtune/model/response.py", userMessage);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Python script failed with exit code " + exitCode);
            }

            return output.toString();
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Failed to call Python script", e);
        }
    }

    private String generateGPTVoiceResponse(String inputAudioUrl) {
        // 실제로는 mp3를 분석해서 응답 생성
        return "챗봇의 응답 메시지"; // 예시 응답
    }

    private UserEntity getUserOrThrow(Long uno) {
        return userRepository.findById(uno)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
    }
}
