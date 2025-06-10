package com.example.codingCamp.profile.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String name;
    private String username;
     private String email;
    private String phone;
    private String role;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Date createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Date updatedAt;
}

