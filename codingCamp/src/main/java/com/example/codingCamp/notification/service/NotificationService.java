package com.example.codingCamp.notification.service;

import java.util.List;

import com.example.codingCamp.notification.dto.response.NotificationResponse;
import com.example.codingCamp.notification.model.Notification;
import com.example.codingCamp.prediction.model.Prediction;

public interface NotificationService {
    void markAllAsRead(Long userId);
    void deleteNotification(Long notificationId) ;
    List<NotificationResponse> getNotificationsByUserId(Long userId);
    void deleteReadNotificationsByUserId(Long userId);
    void sendPredictionNotificationToTeachers(Prediction prediction);
    void sendPredictionNotificationToStudent(Prediction prediction, Long studentId);
    void sendPredictionNotificationToParent(Prediction prediction, Long parentId);
    List<NotificationResponse> getAllNotification();
}
