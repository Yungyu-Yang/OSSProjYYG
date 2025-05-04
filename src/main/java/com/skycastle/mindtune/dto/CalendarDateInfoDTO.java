package com.skycastle.mindtune.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CalendarDateInfoDTO {
    private String created_at;
    private Long eino;
    private String einoimg;
    private Long nino;
    private String ninoimg;
} 