package com.skycastle.mindtune.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ChatLogDTO {
    private String chat;
    private int isbot;
    private LocalDateTime created_at;
}
