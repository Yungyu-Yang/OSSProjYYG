package com.skycastle.mindtune.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class CalendarDayDetailResponseDTO {
    private Long uno;
    private Long ano;
    private String anoImg;
    private String anoName;
    private Long eino;
    private String einoImg;
    private List<ChatLogDTO> chats;
    private String music;
} 