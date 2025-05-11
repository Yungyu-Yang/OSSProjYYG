package com.skycastle.mindtune.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PromptStyleResponseDTO {
    private String style; // "expressive" or "counter"
    private String description;
}
