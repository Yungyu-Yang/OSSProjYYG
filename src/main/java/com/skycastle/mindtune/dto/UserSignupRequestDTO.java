package com.skycastle.mindtune.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSignupRequestDTO {
    private String name;
    private String email;
    private String password;
}