package com.skycastle.mindtune.service;

import com.google.cloud.texttospeech.v1.*;

import com.google.protobuf.ByteString;
import com.skycastle.mindtune.dto.*;
import com.skycastle.mindtune.entity.AvaEntity;
import com.skycastle.mindtune.entity.ChatEntity;
import com.skycastle.mindtune.entity.UserAvaEntity;
import com.skycastle.mindtune.entity.UserEntity;
import com.skycastle.mindtune.repository.AvaRepository;
import com.skycastle.mindtune.repository.ChatRepository;
import com.skycastle.mindtune.repository.UserAvaRepository;
import com.skycastle.mindtune.repository.UserRepository;
import com.skycastle.mindtune.voice.VoiceStyle;
import com.skycastle.mindtune.voice.VoiceStyleConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
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
                .createdAt(botChat.getCreatedAt())
                .build();
    }

    //음성 채팅 저장, 응답 생성
    public ChatResponseDTO saveVoiceChat(Long uno, VoiceChatSaveRequestDTO request) {
        UserEntity user = getUserOrThrow(uno);

        String voiceUrl = request.getVoiceurl();
        String convertText = generateSTT(voiceUrl);

        ChatEntity userChat = ChatEntity.builder()
                .userEntity(user)
                .chat(convertText)
                .isBot(0)
                .createdAt(LocalDateTime.now())
                .build();
        chatRepository.save(userChat);

        String gptReply = generateGPTVoiceResponse(convertText);

        ChatEntity botChat = ChatEntity.builder()
                .userEntity(user)
                .chat(gptReply)
                .isBot(1)
                .createdAt(LocalDateTime.now())
                .build();
        chatRepository.save(botChat);

        // tts
        String filename = generateTTS(gptReply, uno);

        return ChatResponseDTO.builder()
                .userChat(userChat.getChat())
                .userIsbot(userChat.getIsBot())
                .userCreatedAt(userChat.getCreatedAt())
                .chat(botChat.getChat())
                .isbot(botChat.getIsBot())
                .createdAt(botChat.getCreatedAt())
                .audioUrl(filename)
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

        String name = avaRepository.findByAno(ano)
                .map(AvaEntity::getName)
                .orElseThrow(() -> new IllegalArgumentException("아바타 이름이 존재하지 않습니다."));


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
                .avaName(name)
                .anoImg(imgUrl)
                .chats(chats)
                .build();
    }

    private String generateGPTResponse(String userMessage) {
        try {
            ProcessBuilder pb = new ProcessBuilder("python", "src/main/java/com/skycastle/mindtune/model/generate_response.py", userMessage);
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

    private String generateGPTVoiceResponse(String convertText) {
        try {
            ProcessBuilder pb = new ProcessBuilder("python", "src/main/java/com/skycastle/mindtune/model/generate_response.py", convertText);
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

    private UserEntity getUserOrThrow(Long uno) {
        return userRepository.findById(uno)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
    }

    private String generateTTS(String text, Long uno) {
        try (TextToSpeechClient textToSpeechClient = TextToSpeechClient.create()) {

            // 1. uno로 ano 조회
            UserAvaEntity userAva = userAvaRepository.findByUno(uno);
            if (userAva == null) {
                throw new RuntimeException("아바타 정보가 없습니다.");
            }
            Long ano = userAva.getAno();
            System.out.println("Find ano: " + ano);

            // 2. voiceMap에서 VoiceStyle 가져오기
            VoiceStyle style = VoiceStyleConfig.voiceMap.getOrDefault(
                    ano.intValue(),
                    new VoiceStyle("ko-KR-Standard-A", "<prosody rate='fast' pitch='+2st'>")
            );
            System.out.println("Get style: " + style);

            // 3. SSML 태그로 감정 스타일 적용
            String ssml = "<speak>" + style.getProsodyTag() + text + "</prosody></speak>";
            System.out.println("Generated SSML: " + ssml);

            // 4. 입력 설정 (SSML 사용!)
            SynthesisInput input = SynthesisInput.newBuilder()
                    .setSsml(ssml)
                    .build();

            VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
                    .setLanguageCode("en-US")
                    .setName(style.getVoiceName())
                    .build();

            AudioConfig audioConfig = AudioConfig.newBuilder()
                    .setAudioEncoding(AudioEncoding.MP3)
                    .build();

            SynthesizeSpeechResponse response = textToSpeechClient.synthesizeSpeech(input, voice, audioConfig);
            System.out.println("Response received: " + response);
            ByteString audioContents = response.getAudioContent();

//            // 5. mp3 파일 저장
//            String filename = UUID.randomUUID().toString();
//            Path outputPath = Paths.get("src/main/resources/static/audio/" + filename + ".mp3");
//
//            try {
//                Files.write(outputPath, audioContents.toByteArray());
//            } catch (IOException e) {
//                e.printStackTrace();
//                throw new RuntimeException("오디오 파일 저장 중 오류 발생: " + e.getMessage(), e);
//            }
//
//            return filename;
            String base64Audio = Base64.getEncoder().encodeToString(audioContents.toByteArray());

            return base64Audio;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("TTS 변환 중 오류 발생");
        }
    }

    private String generateSTT(String voiceUrl) {
        boolean isWebUrl = voiceUrl.startsWith("http://") || voiceUrl.startsWith("https://");
        Path tempFilePath = null;
        try {
            String filePathToUse;
            if (isWebUrl) {
                // 1. 임시 파일 경로 생성
                String tempFileName = "temp_voice_" + System.currentTimeMillis() + ".mp3";
                tempFilePath = Paths.get(System.getProperty("java.io.tmpdir"), tempFileName);
                // 2. 파일 다운로드
                java.net.URL url = new java.net.URL(voiceUrl);
                try (java.io.InputStream in = url.openStream()) {
                    java.nio.file.Files.copy(in, tempFilePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                }
                filePathToUse = tempFilePath.toString();
            } else {
                // 로컬 파일 경로 사용
                filePathToUse = voiceUrl;
            }

            // 3. stt.py 호출
            ProcessBuilder pb = new ProcessBuilder(
                    "python",
                    "src/main/java/com/skycastle/mindtune/model/stt.py",
                    filePathToUse
            );
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
                System.err.println("Python error output: " + output);
                throw new RuntimeException("stt.py failed with exit code " + exitCode + ": " + output);
            }

            return output.toString();
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Failed to run STT conversion", e);
        } finally {
            // 4. 임시 파일 삭제 (웹에서 다운로드한 경우만)
            if (isWebUrl && tempFilePath != null) {
                try {
                    java.nio.file.Files.deleteIfExists(tempFilePath);
                } catch (IOException ignore) {}
            }
        }
    }

}
