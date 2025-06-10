package com.example.codingCamp.notification.controller;


import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.codingCamp.auth.service.AuthService;
import com.example.codingCamp.dto.BaseResponseDTO;
import com.example.codingCamp.notification.dto.response.NotificationResponse;
import com.example.codingCamp.notification.service.NotificationService;

import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/notification")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    AuthService authService;

    @GetMapping("viewall")
    public ResponseEntity<?> getAllNotification() {
        var baseResponseDTO = new BaseResponseDTO<List<NotificationResponse>>();
        try {
            List<NotificationResponse> notifications = notificationService.getAllNotification();
            baseResponseDTO.setMessage("Berhasil mendapatkan notifikasi");
            baseResponseDTO.setStatus(HttpStatus.OK.value());
            baseResponseDTO.setTimestamp(new Date());
            baseResponseDTO.setData(notifications);
            return new ResponseEntity<>(baseResponseDTO, HttpStatus.OK);
        } catch(Exception e) {
            baseResponseDTO.setMessage("Gagal mendapatkan notifikasi: " + e.getMessage());
            baseResponseDTO.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            baseResponseDTO.setTimestamp(new Date());
            return new ResponseEntity<>(baseResponseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("")
    public ResponseEntity<?> getNotificationByUser() {
        var baseResponseDTO = new BaseResponseDTO<List<NotificationResponse>>();
        var userId = authService.getCurrentUserId();
        try {
            List<NotificationResponse> notifications = notificationService.getNotificationsByUserId(userId);
            baseResponseDTO.setMessage("Berhasil mendapatkan notifikasi");
            baseResponseDTO.setStatus(HttpStatus.OK.value());
            baseResponseDTO.setTimestamp(new Date());
            baseResponseDTO.setData(notifications);
            return new ResponseEntity<>(baseResponseDTO, HttpStatus.OK);
        } catch(Exception e) {
            baseResponseDTO.setMessage("Gagal mendapatkan notifikasi: " + e.getMessage());
            baseResponseDTO.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            baseResponseDTO.setTimestamp(new Date());
            return new ResponseEntity<>(baseResponseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
