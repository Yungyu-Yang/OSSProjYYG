package com.skycastle.mindtune.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserMypageResponseDTO {
    private Long uno;
    private String name;
    private String email;
    private Long ano;
    private String anoImg;
    private int attend;
}
