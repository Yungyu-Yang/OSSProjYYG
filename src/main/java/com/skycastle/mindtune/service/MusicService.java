package com.skycastle.mindtune.service;

import com.skycastle.mindtune.dto.CalendarMusicResponseDTO;
import com.skycastle.mindtune.dto.MusicGenerationRequestDTO;
import com.skycastle.mindtune.dto.PromptStyleResponseDTO;
import com.skycastle.mindtune.entity.*;
import com.skycastle.mindtune.repository.*;
import lombok.RequiredArgsConstructor;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
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
    private final UserAvaRepository userAvaRepository;
    private final EmotionIconRepository emotionIconRepository;
    private final NoteIconRepository noteIconRepository;
    private final CalenderRepository calenderRepository;

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
                "python", "src/main/java/com/skycastle/mindtune/model/function_call.py", "style", chatContents
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
                "python", "src/main/java/com/skycastle/mindtune/model/function_call.py", "daily", chatContents, request.getStyle(), request.getDescription()
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

        Long ano = userAvaRepository.findByUno(uno).getAno();
        Long eno = emotionEntity.getEno();

        // emotion_icon_table에서 eieno 조회
        EmotionIconEntity emotionIconEntity = emotionIconRepository.findByAnoAndEno(ano, eno)
                .orElseThrow(() -> new IllegalArgumentException("해당 아바타와 감정에 맞는 아이콘이 없습니다."));

        // note_icon_table에서 nino 조회
        NoteIconEntity noteIconEntity = noteIconRepository.findByName(emotion.toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("노트 아이콘 정보를 찾을 수 없습니다."));

        // calendar_table에 저장
        CalenderEntity calendar = CalenderEntity.builder()
                .uno(uno)
                .eino(emotionIconEntity.getEino())
                .nino(noteIconEntity.getNino())
                .createdAt(LocalDateTime.now())
                .build();
        calenderRepository.save(calendar);


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
        try {
            // Python 스크립트 실행: prompt를 인자로 전달
            ProcessBuilder pb = new ProcessBuilder(
                    "python",
                    "src/main/java/com/skycastle/mindtune/model/generate_music.py",
                    prompt
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

            // .mp3 URL만 출력된다고 가정하고 그대로 반환
            return output.toString();
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Failed to call Python script", e);
        }
    }

    public void saveLatestMusic(Long uno, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay(); // 00:00:00
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX); // 23:59:59.999999999

        List<DayMusicEntity> musicList = dayMusicRepository
                .findByUnoAndCreatedAtBetweenOrderByCreatedAtDesc(uno, startOfDay, endOfDay);

        if (musicList.size() <= 1) return;

        List<DayMusicEntity> toDelete = musicList.subList(1, musicList.size());
        dayMusicRepository.deleteAll(toDelete);
    }

}