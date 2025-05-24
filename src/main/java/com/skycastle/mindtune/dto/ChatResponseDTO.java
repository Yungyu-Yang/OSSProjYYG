package com.skycastle.mindtune.dto;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder

public class ChatResponseDTO {
    private String userChat;
    private Integer userIsbot;
    private LocalDateTime userCreatedAt;

    private String chat;
    private int isbot;
    private LocalDateTime createdAt;
    private String audioUrl;
}
