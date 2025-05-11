package com.skycastle.mindtune.controller;

import com.skycastle.mindtune.auth.JwtTokenProvider;
import com.skycastle.mindtune.dto.*;
import com.skycastle.mindtune.reponse.BaseResponse;
import com.skycastle.mindtune.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;

@RestController
@RequestMapping("/calendar")
@RequiredArgsConstructor
public class CalendarController {
    private final CalendarService calendarService;
    private final JwtTokenProvider jwtTokenProvider;

    // 하루 기록 조회
    @GetMapping("/detail")
    public ResponseEntity<?> getDayDetail(@RequestHeader("Authorization") String token,
                                          @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        String jwtToken = token.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }
        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CalendarDayDetailResponseDTO result = calendarService.getDayDetail(uno, date);
        BaseResponse<CalendarDayDetailResponseDTO> response = new BaseResponse<>(1000, "하루 기록 조회에 성공하였습니다.", result);
        return ResponseEntity.ok(response);
    }

    // 캘린더 월별 조회
    @GetMapping("")
    public ResponseEntity<?> getMonthCalendar(@RequestHeader("Authorization") String token,
                                              @RequestParam("month") String monthStr) {
        String jwtToken = token.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }
        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        YearMonth month = YearMonth.parse(monthStr); // 예: 2025-04
        CalendarMonthResponseDTO result = calendarService.getMonthCalendar(uno, month);
        BaseResponse<CalendarMonthResponseDTO> response = new BaseResponse<>(1000, "캘린더 조회에 성공했습니다.", result);
        return ResponseEntity.ok(response);
    }

    // 이달의 음악 조회
    @GetMapping("/music")
    public ResponseEntity<?> getMonthMusic(@RequestHeader("Authorization") String token,
                                           @RequestParam("month") String monthStr) {
        String jwtToken = token.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }
        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        YearMonth month = YearMonth.parse(monthStr);
        CalendarMusicResponseDTO result = calendarService.getMonthMusic(uno, month);
        BaseResponse<CalendarMusicResponseDTO> response = new BaseResponse<>(1000, "음악 조회에 성공했습니다.", result);
        return ResponseEntity.ok(response);
    }

    // 이달의 음악 생성 요청
    @PostMapping("/music/generate")
    public ResponseEntity<?> generateMonthMusic(@RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }
        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        CalendarMusicResponseDTO result = calendarService.generateMonthMusic(uno);
        BaseResponse<CalendarMusicResponseDTO> response = new BaseResponse<>(1000, "음악이 성공적으로 생성되었습니다.", result);
        return ResponseEntity.ok(response);
    }
} 