package com.skycastle.mindtune.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AvatarLockInfoResponseDTO {
    private Long uno;
    private Long ano;
    private String anoImg;
    private int status;
} 