package com.example.codingCamp.notification.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NotificationResponse {

    private Long id;

    private Long userId;

    private String title;

    private String message;

    private String type;

    private Boolean isRead = false;

    private Date createdAt;

    private Date updatedAt;

    private Date readAt;
}

