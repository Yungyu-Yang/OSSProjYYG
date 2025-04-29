package com.skycastle.mindtune.auth;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);  // 비밀 키 자동 생성

    // JWT 토큰 생성
    public static String createToken(Long uno) {
        return Jwts.builder()
                .setSubject(String.valueOf(uno))  // ID를 Subject로 설정
                .setIssuedAt(new Date())  // 발급 시간
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))  // 1시간 유효
                .signWith(SECRET_KEY)  // 자동으로 생성된 비밀 키로 서명
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(SECRET_KEY)  // 서명에 사용된 키로 검증
                    .parseClaimsJws(token);  // 토큰 검증
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;  // 토큰이 유효하지 않으면 false 반환
        }
    }

}