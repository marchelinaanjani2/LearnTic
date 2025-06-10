package com.example.codingCamp.notification.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.client.RestTemplate;

import com.example.codingCamp.notification.dto.response.NotificationResponse;
import com.example.codingCamp.notification.model.Notification;
import com.example.codingCamp.notification.repository.NotificationRepository;
import com.example.codingCamp.prediction.dto.response.PredictionResponseDTO;
import com.example.codingCamp.prediction.model.Prediction;
import com.example.codingCamp.profile.model.Student;
import com.example.codingCamp.profile.model.UserModel;
import com.example.codingCamp.profile.repository.RoleRepository;
import com.example.codingCamp.profile.repository.UserRepository;
import com.example.codingCamp.profile.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<NotificationResponse> getNotificationsByUserId(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        notifications.sort(
                Comparator.comparing(Notification::getUpdatedAt, Comparator.nullsLast(Date::compareTo)).reversed());
        return notifications.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationResponse> getAllNotification() {
        List<Notification> notifications = notificationRepository.findAll();
        notifications.sort(
                Comparator.comparing(Notification::getUpdatedAt, Comparator.nullsLast(Date::compareTo)).reversed());
        return notifications.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        Date now = new Date();
        for (Notification notification : notifications) {
            notification.setIsRead(true);
            notification.setReadAt(now);
            notification.setUpdatedAt(now);
        }
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    @Override
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with ID: " + notificationId));
        if (notification.getIsRead()) {
            notificationRepository.deleteById(notificationId);
        } else {
            throw new IllegalArgumentException("Cannot delete notification that hasn't been read yet");
        }
    }

    @Transactional
    @Override
    public void deleteReadNotificationsByUserId(Long userId) {
        notificationRepository.deleteByUserIdAndIsReadTrue(userId);
    }

    private NotificationResponse convertToResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setUserId(notification.getUserId());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setType(notification.getType());
        response.setIsRead(notification.getIsRead());
        response.setCreatedAt(notification.getCreatedAt());
        response.setUpdatedAt(notification.getUpdatedAt());
        response.setReadAt(notification.getReadAt());
        return response;
    }

    private String determineNotificationType(String predictionStatus) {
        if (predictionStatus.equalsIgnoreCase("Significant Increase Performance")) {
            return "INFO";
        } else if (predictionStatus.equalsIgnoreCase("Stable Performance")) {
            return "WARNING";
        } else if (predictionStatus.equalsIgnoreCase("Significant Decrease Performance")) {
            return "ERROR";
        } else {
            return "INFO";
        }
    }

    @Override
    public void sendPredictionNotificationToTeachers(Prediction prediction) {
        try {
            List<UserModel> teachers = getTeachersOnly();
            if (teachers.isEmpty()) {
                log.warn("No teachers found to send notification");
                return;
            }

            String title = "📊 Prediksi Performa Siswa: " + prediction.getNamaSiswa();
            String message = buildTeacherNotificationMessage(prediction);
            String notificationType = determineNotificationType(prediction.getStatusPrediksi());

            for (UserModel teacher : teachers) {
                createAndSaveNotification(teacher.getId(), title, message, notificationType);
            }

            log.info("Prediction notification sent to {} teachers for student {}",
                    teachers.size(), prediction.getNamaSiswa());
        } catch (Exception e) {
            log.error("Failed to send notification to teachers: {}", e.getMessage());
        }
    }

    @Override
    public void sendPredictionNotificationToStudent(Prediction prediction, Long studentId) {
        try {
            UserModel student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
            String title = "📊 Prediksi Performa Anda";
            String message = buildStudentNotificationMessage(prediction);
            String notificationType = determineNotificationType(prediction.getStatusPrediksi());
            createAndSaveNotification(student.getId(), title, message, notificationType);
            log.info("Prediction notification sent to student {}", studentId);
        } catch (Exception e) {
            log.error("Failed to send notification to student {}: {}", studentId, e.getMessage());
        }
    }

    @Override
    public void sendPredictionNotificationToParent(Prediction prediction, Long parentId) {
        try {
            UserModel parent = userRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent not found with ID: " + parentId));
            String title = "📊 Prediksi Performa " + prediction.getNamaSiswa();
            String message = buildParentNotificationMessage(prediction);
            String notificationType = determineNotificationType(prediction.getStatusPrediksi());
            createAndSaveNotification(parent.getId(), title, message, notificationType);
            log.info("Prediction notification sent to parent {}", parentId);
        } catch (Exception e) {
            log.error("Failed to send notification to parent {}: {}", parentId, e.getMessage());
        }
    }

    private String buildTeacherNotificationMessage(Prediction prediction) {
        return String.format(
                "Siswa %s (Semester %d) memiliki prediksi performa:\n" +
                        "Status: %s\n" +
                        "Nilai Akhir: %.2f\n" +
                        "Ketidakhadiran: %d\n" +
                        "Persentase Tugas: %d%%\n\n" +
                        "Silakan tinjau dan berikan intervensi jika diperlukan.",
                prediction.getNamaSiswa(),
                prediction.getSemesterSiswa(),
                prediction.getStatusPrediksi(),
                prediction.getNilaiAkhir(),
                prediction.getJumlahKetidakhadiran(),
                prediction.getPersentaseTugas());
    }

    private String buildStudentNotificationMessage(Prediction prediction) {
        String status = prediction.getStatusPrediksi();
        switch (status) {
            case "Significant Increase Performance":
                return "Selamat! Performa Anda diprediksi akan meningkat secara signifikan. Terus pertahankan kerja keras Anda!";
            case "Stable Performance":
                return "Performa Anda diprediksi akan tetap stabil. Cobalah tantangan baru untuk meningkatkan hasil belajar Anda!";
            case "Significant Decrease Performance":
                return "Performa Anda diprediksi akan menurun. Silakan konsultasikan dengan guru atau orang tua untuk bantuan.";
            default:
                return "Hasil prediksi performa Anda telah tersedia.";
        }
    }

    private String buildParentNotificationMessage(Prediction prediction) {
        String status = prediction.getStatusPrediksi();
        switch (status) {
            case "Significant Increase Performance":
                return String.format(
                        "Anak Anda, %s, diprediksi akan mengalami peningkatan performa yang signifikan. Terus berikan dukungan dan motivasi!",
                        prediction.getNamaSiswa());
            case "Stable Performance":
                return String.format(
                        "Anak Anda, %s, diprediksi akan mempertahankan performa yang stabil. Dorong mereka untuk mencoba tantangan baru!",
                        prediction.getNamaSiswa());
            case "Significant Decrease Performance":
                return String.format(
                        "Anak Anda, %s, diprediksi akan mengalami penurunan performa. Silakan berkoordinasi dengan guru untuk strategi pendampingan.",
                        prediction.getNamaSiswa());
            default:
                return String.format("Hasil prediksi performa untuk %s telah tersedia.", prediction.getNamaSiswa());
        }
    }

    private void createAndSaveNotification(Long userId, String title, String message, String type) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setIsRead(false);
        notification.setCreatedAt(new Date());
        notification.setUpdatedAt(new Date());
        notificationRepository.save(notification);
    }

    private List<UserModel> getTeachersOnly() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != null &&
                        user.getRole().getRole().equalsIgnoreCase("TEACHER"))
                .collect(Collectors.toList());
    }

    private static class NotificationContent {
        String title;
        String message;

        NotificationContent(String title, String message) {
            this.title = title;
            this.message = message;
        }
    }

    private NotificationContent createTeacherAdminNotificationContent(Student siswa, String predictionStatus) {
        String title;
        String message;

        switch (predictionStatus) {
            case "Significant Increase Performance":
                title = "📈 Prediksi Peningkatan Performa";
                message = String.format("Siswa %s diprediksi akan mengalami peningkatan performa yang signifikan. " +
                        "Pertahankan strategi pembelajaran yang sudah berjalan dengan baik dan berikan dukungan tambahan.",
                        siswa.getName());
                break;
            case "Stable Performance":
                title = "📊 Prediksi Performa Stabil";
                message = String.format("Siswa %s diprediksi akan mempertahankan performa yang stabil. " +
                        "Pantau terus perkembangan dan dukung peningkatan.", siswa.getName());
                break;
            case "Significant Decrease Performance":
                title = "📉 Prediksi Penurunan Performa";
                message = String.format("Siswa %s diprediksi akan mengalami penurunan performa. " +
                        "Segera lakukan intervensi dan bimbingan untuk mengatasi permasalahan.",
                        siswa.getName());
                break;
            default:
                title = "📊 Prediksi Performa Siswa";
                message = String.format("Siswa %s memiliki hasil prediksi performa terbaru.", siswa.getName());
        }

        return new NotificationContent(title, message);
    }

}
