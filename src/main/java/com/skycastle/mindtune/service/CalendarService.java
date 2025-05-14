package com.skycastle.mindtune.service;

import com.skycastle.mindtune.dto.*;
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
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarService {
    private final CalenderRepository calenderRepository;
    private final EmotionIconRepository emotionIconRepository;
    private final NoteIconRepository noteIconRepository;
    private final AvaRepository avaRepository;
    private final UserAvaRepository userAvaRepository;
    private final DayMusicRepository dayMusicRepository;
    private final MonthMusicRepository monthMusicRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    // 하루 기록 상세 조회
    public CalendarDayDetailResponseDTO getDayDetail(Long uno, LocalDate date) {
        // 해당 날짜의 캘린더 기록
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        Optional<CalenderEntity> calOpt = calenderRepository.findByUnoAndCreatedAtBetween(uno, start, end)
                .stream().findFirst();
        if (calOpt.isEmpty()) return null;
        CalenderEntity cal = calOpt.get();

        // 아바타 정보
        UserAvaEntity userAva = userAvaRepository.findByUno(uno);
        Long ano = userAva != null ? userAva.getAno() : null;
        String anoImg = (ano != null) ? avaRepository.findByAno(ano).map(AvaEntity::getImg).orElse("") : "";

        // 감정 아이콘 정보
        Long eino = cal.getEino();
        EmotionIconEntity einoEntity = eino != null ? emotionIconRepository.findById(eino).orElse(null) : null;
        String einoImg = (einoEntity != null) ? einoEntity.getImg() : "";

        // 채팅 기록
        UserEntity userEntity = userRepository.findById(uno).orElse(null);
        List<ChatLogDTO> chats = userEntity == null ? List.of() : chatRepository.findByUserEntityAndCreatedAtBetweenOrderByCreatedAtAsc(userEntity, start, end).stream()
                .map(chat -> ChatLogDTO.builder()
                        .chat(chat.getChat())
                        .isbot(chat.getIsBot())
                        .created_at(chat.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        // 음악 정보
        String music = dayMusicRepository.findByUnoAndCreatedAtBetween(uno, start, end).stream()
                .findFirst().map(DayMusicEntity::getMusic).orElse("");

        return CalendarDayDetailResponseDTO.builder()
                .uno(uno)
                .ano(ano)
                .anoImg(anoImg)
                .eino(eino)
                .einoImg(einoImg)
                .chats(chats)
                .music(music)
                .build();
    }

    // 월별 캘린더 조회
    public CalendarMonthResponseDTO getMonthCalendar(Long uno, YearMonth month) {
        LocalDateTime start = month.atDay(1).atStartOfDay();
        LocalDateTime end = month.atEndOfMonth().plusDays(1).atStartOfDay();
        List<CalenderEntity> records = calenderRepository.findByUnoAndCreatedAtBetween(uno, start, end);

        // 아바타 정보
        UserAvaEntity userAva = userAvaRepository.findByUno(uno);
        Long ano = userAva != null ? userAva.getAno() : null;
        String anoimg = (ano != null) ? avaRepository.findByAno(ano).map(AvaEntity::getImg).orElse("") : "";

        List<CalendarDateInfoDTO> dates = records.stream().map(cal -> {
            EmotionIconEntity einoEntity = cal.getEino() != null ? emotionIconRepository.findById(cal.getEino()).orElse(null) : null;
            String einoimg = (einoEntity != null) ? einoEntity.getImg() : "";
            NoteIconEntity ninoEntity = cal.getNino() != null ? noteIconRepository.findById(cal.getNino()).orElse(null) : null;
            String ninoimg = (ninoEntity != null) ? ninoEntity.getImg() : "";
            return CalendarDateInfoDTO.builder()
                    .created_at(cal.getCreatedAt().toLocalDate().toString())
                    .eino(cal.getEino())
                    .einoimg(einoimg)
                    .nino(cal.getNino())
                    .ninoimg(ninoimg)
                    .build();
        }).collect(Collectors.toList());

        return CalendarMonthResponseDTO.builder()
                .uno(uno)
                .ano(ano)
                .anoimg(anoimg)
                .dates(dates)
                .build();
    }

    // 이달의 음악 조회
    public CalendarMusicResponseDTO getMonthMusic(Long uno, YearMonth month) {
        LocalDateTime start = month.atDay(1).atStartOfDay();
        LocalDateTime end = month.atEndOfMonth().plusDays(1).atStartOfDay();
        String music = monthMusicRepository.findByUnoAndCreatedAtBetween(uno, start, end).stream()
                .findFirst().map(MonthMusicEntity::getMusic).orElse("");
        return CalendarMusicResponseDTO.builder()
                .uno(uno)
                .music(music)
                .build();
    }

    // 이달의 음악 생성
    public CalendarMusicResponseDTO generateMonthMusic(Long uno) {

        LocalDate today = LocalDate.now();
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        LocalDate lastDayOfMonth = today.withDayOfMonth(today.lengthOfMonth());
        LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();
        LocalDateTime endOfMonth = lastDayOfMonth.atTime(LocalTime.MAX);

        // 해당 월에 이미 생성된 음악이 있는지 확인
//        List<MonthMusicEntity> musics = monthMusicRepository.findByUnoAndCreatedAtBetween(uno, startOfMonth, endOfMonth);
//        if (!musics.isEmpty()) {
//            MonthMusicEntity music = musics.get(0);
//            return new CalendarMusicResponseDTO(music.getUno(), music.getMusic());
//        }

        // 이번 달의 채팅 내역 조회
        List<ChatEntity> chatList = chatRepository.findByUserEntity_UnoAndCreatedAtBetween(uno, startOfMonth, endOfMonth);
        if (chatList.isEmpty()) {
            throw new IllegalArgumentException("이번 달에 대화 기록이 없습니다.");
        }

        // 사용자 메시지만 추출해서 문자열로 가공
        String chatContents = chatList.stream()
                .filter(chat -> chat.getIsBot() == 0)
                .map(ChatEntity::getChat)
                .collect(Collectors.joining("\n"));

        // 파이썬 스크립트 실행
        String[] command = {
                "python", "src/main/java/com/skycastle/mindtune/model/function_call.py", "monthly", chatContents
        };

        String result = runPythonScript(command);
        String prompt;
        try {
            JSONObject json = new JSONObject(result);
            prompt = json.getString("prompt");
        } catch (JSONException e) {
            throw new RuntimeException("JSON 파싱 중 오류 발생: " + e.getMessage(), e);
        }

        System.out.println("GPT FunctionCalling 결과: " + result);
        System.out.println("Parsed Prompt: " + prompt);

        // 음악 생성
        String musicResult = generateMusic(prompt);

        MonthMusicEntity newMusic = MonthMusicEntity.builder()
                .uno(uno)
                .prompt(prompt)
                .music(musicResult)
                .createdAt(LocalDateTime.now())
                .build();
        monthMusicRepository.save(newMusic);

        return new CalendarMusicResponseDTO(uno, musicResult);
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
                throw new RuntimeException("Python script failed with exit code " + exitCode);
            }

            // .mp3 URL만 출력된다고 가정하고 그대로 반환
            return output.toString();
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Failed to call Python script", e);
        }
    }
} 