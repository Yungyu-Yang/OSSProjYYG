package com.skycastle.mindtune.dto;

import lombok.*;
import java.util.List;

@Getter
@Builder
public class ChatHistoryResponseDTO {
    private Long uno;
    private Long ano;
    private String anoImg;
    private List<ChatLogDTO> chats;
}
