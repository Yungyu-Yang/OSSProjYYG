package com.skycastle.mindtune.service;

import com.skycastle.mindtune.dto.*;
import com.skycastle.mindtune.entity.*;
import com.skycastle.mindtune.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    // 이달의 음악 생성 (샘플: 실제 생성 로직은 별도 구현 필요)
    public CalendarMusicResponseDTO generateMonthMusic(Long uno, YearMonth month, String musicPath) {
        LocalDateTime createdAt = month.atDay(1).atStartOfDay();
        MonthMusicEntity entity = MonthMusicEntity.builder()
                .uno(uno)
                .prompt(month.toString())
                .music(musicPath)
                .createdAt(createdAt)
                .build();
        monthMusicRepository.save(entity);
        return CalendarMusicResponseDTO.builder()
                .uno(uno)
                .music(musicPath)
                .build();
    }
} 