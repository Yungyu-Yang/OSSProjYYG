package com.skycastle.mindtune.controller;

import com.skycastle.mindtune.auth.JwtTokenProvider;
import com.skycastle.mindtune.dto.CalendarMusicResponseDTO;
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
import java.util.Map;

@RestController
@RequestMapping("/music")
@RequiredArgsConstructor
public class MusicController {

    private final MusicService musicService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/generate")
    public ResponseEntity<?> createDayMusic(@RequestHeader("Authorization") String token) {

        String jwtToken = token.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }

        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        CalendarMusicResponseDTO musicResponse = musicService.getTodayMusicByUno(uno);

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


}
