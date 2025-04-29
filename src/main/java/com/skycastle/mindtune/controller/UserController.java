package com.skycastle.mindtune.controller;

import com.skycastle.mindtune.auth.JwtTokenProvider;
import com.skycastle.mindtune.dto.UserLoginRequestDTO;
import com.skycastle.mindtune.dto.UserSignupRequestDTO;
import com.skycastle.mindtune.reponse.BaseResponse;
import com.skycastle.mindtune.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserSignupRequestDTO request) {
        Long uno = userService.signup(request);

        Map<String, Object> body = new HashMap<>();
        body.put("uno", uno);

        BaseResponse<Map<String, Object>> response = new BaseResponse<>(1000, "회원가입에 성공하였습니다.", body);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/checkemail")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        if (userService.isEmailDuplicate(email)) {
            return ResponseEntity.status(409).body(new BaseResponse<>(2004, "이미 사용 중인 이메일입니다.", null));
        } else {
            return ResponseEntity.ok(new BaseResponse<>(1000, "이메일을 사용하실 수 있습니다.", null));
        }
    }

    @GetMapping("/checkname")
    public ResponseEntity<?> checkName(@RequestParam String name) {
        if (userService.isNameDuplicate(name)) {
            return ResponseEntity.status(409).body(new BaseResponse<>(2001, "이미 사용 중인 닉네임입니다.", null));
        } else {
            return ResponseEntity.ok(new BaseResponse<>(1000, "닉네임을 사용하실 수 있습니다.", null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequestDTO request) {
        // 로그인 시 사용자 정보와 함께 JWT 토큰을 생성
        Long uno = userService.login(request);
        String token = JwtTokenProvider.createToken(uno);

        // 응답 본문에 필요한 정보와 토큰 추가
        Map<String, Object> body = new HashMap<>();
        body.put("uno", uno);

        // 응답 헤더에 Authorization 추가
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);

        // 응답 반환
        BaseResponse<Map<String, Object>> response = new BaseResponse<>(1000, "로그인에 성공하였습니다.", body);
        return ResponseEntity.ok().headers(headers).body(response);
    }

}