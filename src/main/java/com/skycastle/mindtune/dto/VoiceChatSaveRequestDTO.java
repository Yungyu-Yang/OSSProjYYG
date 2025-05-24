package com.skycastle.mindtune.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder

public class VoiceChatSaveRequestDTO {
    private String voiceurl;

    public VoiceChatSaveRequestDTO(String voiceurl) {
        this.voiceurl = voiceurl;
    }
}
