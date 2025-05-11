package com.skycastle.mindtune.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MusicGenerationRequestDTO {
    private String style;
    private String description;
}

