package com.skycastle.mindtune.controller;

import com.skycastle.mindtune.auth.JwtTokenProvider;
import com.skycastle.mindtune.dto.CalendarMusicResponseDTO;
import com.skycastle.mindtune.dto.MusicGenerationRequestDTO;
import com.skycastle.mindtune.dto.PromptStyleResponseDTO;
import com.skycastle.mindtune.reponse.BaseResponse;
import com.skycastle.mindtune.service.MusicService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/music")
@RequiredArgsConstructor
public class MusicController {

    private final MusicService musicService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeEmotion(@RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }

        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<PromptStyleResponseDTO> response = musicService.analyzeEmotion(uno);

        return ResponseEntity.ok(new BaseResponse<>(1000, "감정 분석 완료", response));
    }

    @PostMapping("/generate")
    public ResponseEntity<?> createDayMusic(@RequestHeader("Authorization") String token,
                                            @RequestBody MusicGenerationRequestDTO request) {

        String jwtToken = token.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }

        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        CalendarMusicResponseDTO musicResponse = musicService.getTodayMusicByUno(uno, request);

        Map<String, Object> body = new HashMap<>();
        body.put("uno", musicResponse.getUno());
        body.put("music", musicResponse.getMusic());

        BaseResponse<Map<String, Object>> response = new BaseResponse<>(1000, "음악이 성공적으로 생성되었습니다.", body);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getDayMusic(@RequestHeader("Authorization") String token,
                                         @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        String jwtToken = token.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(jwtToken)) {
            throw new IllegalArgumentException("Invalid or expired token");
        }

        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        CalendarMusicResponseDTO musicResponse = musicService.getDayMusicByDate(uno, date);

        Map<String, Object> body = new HashMap<>();
        body.put("uno", musicResponse.getUno());
        body.put("music", musicResponse.getMusic());

        BaseResponse<Map<String, Object>> response = new BaseResponse<>(1000, "음악 조회에 성공했습니다.", body);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveMusic(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }

        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        musicService.saveLatestMusic(uno, date);
        return ResponseEntity.ok().body("가장 최근 음악만 저장되고, 나머지는 삭제되었습니다.");
    }


}
