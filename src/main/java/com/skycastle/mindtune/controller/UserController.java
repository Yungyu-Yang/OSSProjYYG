package com.skycastle.mindtune.controller;

import com.skycastle.mindtune.auth.JwtTokenProvider;
import com.skycastle.mindtune.dto.*;
import com.skycastle.mindtune.reponse.BaseResponse;
import com.skycastle.mindtune.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

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

        Long uno = userService.login(request);
        String token = jwtTokenProvider.createToken(uno);

        Map<String, Object> body = new HashMap<>();
        body.put("uno", uno);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", token);

        BaseResponse<Map<String, Object>> response = new BaseResponse<>(1000, "로그인에 성공하였습니다.", body);
        return ResponseEntity.ok().headers(headers).body(response);
    }

    @GetMapping("/mypage")
    public ResponseEntity<?> getMypage(@RequestHeader("Authorization") String token) {

        String jwtToken = token.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }

        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UserMypageResponseDTO mypageInfo = userService.getMypage(uno);

        Map<String, Object> body = new HashMap<>();
        body.put("uno", mypageInfo.getUno());
        body.put("name", mypageInfo.getName());
        body.put("email", mypageInfo.getEmail());
        body.put("ano", mypageInfo.getAno());
        body.put("anoImg", mypageInfo.getAnoImg());
        body.put("attend", mypageInfo.getAttend());

        BaseResponse<Map<String, Object>> response = new BaseResponse<>(1000, "마이페이지 정보 조회에 성공하였습니다.", body);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/home")
    public ResponseEntity<?> getHome(@RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }

        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UserHomeRequestDTO getHomeInfo = userService.getHome(uno);

        Map<String, Object> body = new HashMap<>();
        body.put("uno", getHomeInfo.getUno());
        body.put("ano", getHomeInfo.getAno());
        body.put("anoImg", getHomeInfo.getAnoImg());

        BaseResponse<Map<String, Object>> response = new BaseResponse<>(1000, "홈 화면 정보 조회에 성공하였습니다.", body);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String token) {

        String jwtToken = token.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }

        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UserInfoResponseDTO userInfo = userService.getUserInfo(uno);

        Map<String, Object> body = new HashMap<>();
        body.put("uno", userInfo.getUno());
        body.put("name", userInfo.getName());
        body.put("email", userInfo.getEmail());

        BaseResponse<Map<String, Object>> response = new BaseResponse<>(1000, "회원 정보 조회에 성공하였습니다.", body);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/changeinfo")
    public ResponseEntity<?> changeUserInfo(@RequestHeader("Authorization") String token, @RequestBody UserChangeInfoRequestDTO request) {

        String jwtToken = token.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }

        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UserChangeInfoResponseDTO updatedUser = userService.updateUserInfo(uno, request);

        Map<String, Object> body = new HashMap<>();
        body.put("uno", uno);
        body.put("name", updatedUser.getName());
        body.put("email", updatedUser.getEmail());

        BaseResponse<Map<String, Object>> response = new BaseResponse<>(1000, "회원 정보 수정에 성공하였습니다.", body);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {

        String jwtToken = token.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }

        // 실제 토큰 삭제는 클라이언트에서만 함
        // 여기선 단순히 성공 메시지만 전달
        BaseResponse<String> response = new BaseResponse<>(1000, "로그아웃에 성공하였습니다.", null);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestHeader("Authorization") String token) {

        String jwtToken = token.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(jwtToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }

        Long uno = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        userService.withdrawUser(uno);

        BaseResponse<Map<String, Object>> response = new BaseResponse<>(1000, "회원 탈퇴에 성공하였습니다.", null);
        return ResponseEntity.ok(response);
    }

}