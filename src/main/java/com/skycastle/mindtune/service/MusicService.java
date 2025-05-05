package com.skycastle.mindtune.service;

import com.skycastle.mindtune.dto.CalendarMusicResponseDTO;
import com.skycastle.mindtune.entity.DayMusicEntity;
import com.skycastle.mindtune.repository.DayMusicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MusicService {

    private final DayMusicRepository dayMusicRepository;

    public CalendarMusicResponseDTO getTodayMusicByUno(Long uno) {
        // 오늘 00:00:00 ~ 23:59:59.999999 생성 범위 설정
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        // uno, created_at 으로 생성된 음악 조회
        List<DayMusicEntity> musics = dayMusicRepository.findByUnoAndCreatedAtBetween(uno, startOfDay, endOfDay);

        // 존재하지 않으면 예외 발생
        if (musics.isEmpty()) {
            throw new IllegalArgumentException("오늘 생성된 음악이 존재하지 않습니다.");
        }

        // 하루에 한 곡만 생성되므로 첫번째 것만 사용(DayMusicRepository 에서 List로 구현되어 있어서 get(0)으로 구현)
        DayMusicEntity music = musics.get(0);

        return new CalendarMusicResponseDTO(
                music.getUno(),
                music.getMusic()
        );
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
}