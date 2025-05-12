package com.skycastle.mindtune.service;

import com.skycastle.mindtune.dto.CalendarMusicResponseDTO;
import com.skycastle.mindtune.dto.MusicGenerationRequestDTO;
import com.skycastle.mindtune.dto.PromptStyleResponseDTO;
import com.skycastle.mindtune.entity.ChatEntity;
import com.skycastle.mindtune.entity.DayMusicEntity;
import com.skycastle.mindtune.entity.EmotionEntity;
import com.skycastle.mindtune.repository.ChatRepository;
import com.skycastle.mindtune.repository.DayMusicRepository;
import com.skycastle.mindtune.repository.EmotionRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MusicService {

    private final DayMusicRepository dayMusicRepository;
    private final ChatRepository chatRepository;
    private final EmotionRepository emotionRepository;

    public List<PromptStyleResponseDTO> analyzeEmotion(Long uno) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        // 채팅 내역 조회
        List<ChatEntity> chatList = chatRepository.findByUserEntity_UnoAndCreatedAtBetween(uno, startOfDay, endOfDay);
        if (chatList.isEmpty()) {
            throw new IllegalArgumentException("오늘 대화 기록이 없습니다.");
        }

        // 메시지 내용만 추출해서 문자열로 가공
        String chatContents = chatList.stream()
                .map(ChatEntity::getChat)
                .collect(Collectors.joining("\n"));

        String[] command = {
                "python3", "src/main/java/com/skycastle/mindtune/model/function_call.py", "style", chatContents
        };

        String result = runPythonScript(command);
        String expressive;
        String counter;
        try {
            JSONObject json = new JSONObject(result);
            expressive = json.getString("expressive");
            counter = json.getString("counter");
        } catch (JSONException e) {
            throw new RuntimeException("JSON 파싱 중 오류 발생: " + e.getMessage(), e);
        }

        List<PromptStyleResponseDTO> options = List.of(
                new PromptStyleResponseDTO("expressive", expressive),
                new PromptStyleResponseDTO("counter", counter)
        );

        return options;

    }

    public CalendarMusicResponseDTO getTodayMusicByUno(Long uno, MusicGenerationRequestDTO request) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        // uno, created_at 으로 생성된 음악 조회
//        List<DayMusicEntity> musics = dayMusicRepository.findByUnoAndCreatedAtBetween(uno, startOfDay, endOfDay);
//        if (!musics.isEmpty()) {
//            DayMusicEntity music = musics.get(0);
//            return new CalendarMusicResponseDTO(music.getUno(), music.getMusic());
//        }

        // 채팅 내역 조회
        List<ChatEntity> chatList = chatRepository.findByUserEntity_UnoAndCreatedAtBetween(uno, startOfDay, endOfDay);
        if (chatList.isEmpty()) {
            throw new IllegalArgumentException("오늘 대화 기록이 없습니다.");
        }

        // 사용자 메시지 내용만 추출해서 문자열로 가공
        String chatContents = chatList.stream()
                .filter(chat -> chat.getIsBot() == 0)
                .map(ChatEntity::getChat)
                .collect(Collectors.joining("\n"));

        String[] command = {
                "python3", "src/main/java/com/skycastle/mindtune/model/function_call.py", "daily", chatContents, request.getStyle(), request.getDescription()
        };

        String result = runPythonScript(command);
        String prompt;
        String emotion;
        try {
            JSONObject json = new JSONObject(result);
            prompt = json.getString("prompt");
            emotion = json.getString("emotion");
        } catch (JSONException e) {
            throw new RuntimeException("JSON 파싱 중 오류 발생: " + e.getMessage(), e);
        }

        System.out.println("GPT FunctionCalling 결과: " + result);
        System.out.println("Parsed Emotion: " + emotion);
        System.out.println("Parsed Prompt: " + prompt);

        EmotionEntity emotionEntity = emotionRepository.findByEmotion(emotion.toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("감정 정보가 DB에 없습니다: " + emotion));
        for (ChatEntity chat : chatList) {
            chat.setEmotionEntity(emotionEntity);
        }
        chatRepository.saveAll(chatList);

        // 음악 생성 로직
        String musicResult = generateMusic(prompt);

        DayMusicEntity newMusic = DayMusicEntity.builder()
                .uno(uno)
                .prompt(prompt)
                .music(musicResult)
                .createdAt(LocalDateTime.now())
                .build();
        dayMusicRepository.save(newMusic);

        return new CalendarMusicResponseDTO(uno, musicResult);
    }

    public CalendarMusicResponseDTO getDayMusicByDate(Long uno, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        List<DayMusicEntity> musics = dayMusicRepository.findByUnoAndCreatedAtBetween(uno, start, end);

        if (musics.isEmpty()) {
            throw new IllegalArgumentException("해당 날짜의 음악이 존재하지 않습니다.");
        }

        DayMusicEntity music = musics.get(0); // 하루에 하나만 존재함을 전제로
        return CalendarMusicResponseDTO.builder()
                .uno(music.getUno())
                .music(music.getMusic())
                .build();
    }

    public String runPythonScript(String[] command) {
        try {
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder result = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                result.append(line).append(System.lineSeparator());
            }

            // 프로세스 종료까지 대기
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Python script failed with exit code " + exitCode);
            }

            return result.toString().trim();
        } catch (Exception e) {
            throw new RuntimeException("Failed to call Python script", e);
        }
    }

    public String generateMusic(String prompt) {
        return "생성된 음악.wav";
    }

}