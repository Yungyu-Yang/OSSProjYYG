package com.skycastle.mindtune.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class CalendarMonthResponseDTO {
    private Long uno;
    private Long ano;
    private String anoimg;
    private List<CalendarDateInfoDTO> dates;
} 