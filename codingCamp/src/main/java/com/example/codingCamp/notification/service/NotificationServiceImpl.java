package com.example.codingCamp.notification.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.codingCamp.notification.dto.response.NotificationResponse;
import com.example.codingCamp.notification.model.Notification;
import com.example.codingCamp.notification.repository.NotificationRepository;
import com.example.codingCamp.prediction.model.Prediction;
import com.example.codingCamp.profile.model.Student;
import com.example.codingCamp.profile.model.UserModel;
import com.example.codingCamp.profile.repository.UserRepository;

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
        if (predictionStatus == null || predictionStatus.trim().isEmpty()) {
            return "INFO";
        }

        switch (predictionStatus.trim().toLowerCase()) {
            case "significant increase performance":
                return "INFO";
            case "stable performance":
                return "WARNING";
            case "significant decrease performance":
                return "ERROR";
            default:
                return "INFO";
        }
    }

    @Override
    public void sendPredictionNotificationToTeachers(Prediction prediction) {
        try {
            // Validasi input prediction
            if (prediction == null) {
                log.error("Prediction object is null");
                return;
            }

            // Validasi dan konversi data prediction
            String namaSiswa = safeGetString(prediction.getNamaSiswa());
            String statusPrediksi = safeGetString(prediction.getStatusPrediksi());
            Double nilaiAkhir = safeGetDouble(prediction.getNilaiAkhir());
            Integer semesterSiswa = safeGetInteger(prediction.getSemesterSiswa());
            Integer jumlahKetidakhadiran = safeGetInteger(prediction.getJumlahKetidakhadiran());
            Integer persentaseTugas = safeGetInteger(prediction.getPersentaseTugas());

            log.info("Processing prediction notification for student: {}", namaSiswa);
            log.debug("Prediction details - Status: {}, Score: {}, Semester: {}",
                    statusPrediksi, nilaiAkhir, semesterSiswa);

            List<UserModel> teachers = getTeachersOnly();
            if (teachers.isEmpty()) {
                log.warn("No teachers found to send notification");
                return;
            }

            String title = "📊 Prediksi Performa Siswa: " + namaSiswa;
            String message = buildTeacherNotificationMessage(
                    namaSiswa, statusPrediksi, nilaiAkhir, semesterSiswa,
                    jumlahKetidakhadiran, persentaseTugas);
            String notificationType = determineNotificationType(statusPrediksi);

            for (UserModel teacher : teachers) {
                createAndSaveNotification(teacher.getId(), title, message, notificationType);
            }

            log.info("Prediction notification sent to {} teachers for student {}",
                    teachers.size(), namaSiswa);
        } catch (Exception e) {
            log.error("Failed to send notification to teachers: {}", e.getMessage());
            log.error("Exception details: ", e);
        }
    }

    @Override
    public void sendPredictionNotificationToStudent(Prediction prediction, Long studentId) {
        try {
            if (prediction == null || studentId == null) {
                log.error("Prediction or studentId is null");
                return;
            }

            UserModel student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

            String statusPrediksi = safeGetString(prediction.getStatusPrediksi());
            String title = "📊 Prediksi Performa Anda";
            String message = buildStudentNotificationMessage(statusPrediksi);
            String notificationType = determineNotificationType(statusPrediksi);

            createAndSaveNotification(student.getId(), title, message, notificationType);
            log.info("Prediction notification sent to student {}", studentId);
        } catch (Exception e) {
            log.error("Failed to send notification to student {}: {}", studentId, e.getMessage());
        }
    }

    @Override
    public void sendPredictionNotificationToParent(Prediction prediction, Long parentId) {
        try {
            if (prediction == null || parentId == null) {
                log.error("Prediction or parentId is null");
                return;
            }

            UserModel parent = userRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent not found with ID: " + parentId));

            String namaSiswa = safeGetString(prediction.getNamaSiswa());
            String statusPrediksi = safeGetString(prediction.getStatusPrediksi());
            String title = "📊 Prediksi Performa " + namaSiswa;
            String message = buildParentNotificationMessage(namaSiswa, statusPrediksi);
            String notificationType = determineNotificationType(statusPrediksi);

            createAndSaveNotification(parent.getId(), title, message, notificationType);
            log.info("Prediction notification sent to parent {}", parentId);
        } catch (Exception e) {
            log.error("Failed to send notification to parent {}: {}", parentId, e.getMessage());
        }
    }

    // Helper methods untuk safe conversion
    private String safeGetString(Object obj) {
        if (obj == null)
            return "N/A";
        return obj.toString().trim();
    }

    private Double safeGetDouble(Object obj) {
        if (obj == null)
            return 0.0;
        try {
            if (obj instanceof Double)
                return (Double) obj;
            if (obj instanceof Number)
                return ((Number) obj).doubleValue();
            return Double.parseDouble(obj.toString());
        } catch (NumberFormatException e) {
            log.warn("Failed to convert {} to Double", obj);
            return 0.0;
        }
    }

    private Integer safeGetInteger(Object obj) {
        if (obj == null)
            return 0;
        try {
            if (obj instanceof Integer)
                return (Integer) obj;
            if (obj instanceof Number)
                return ((Number) obj).intValue();
            return Integer.parseInt(obj.toString());
        } catch (NumberFormatException e) {
            log.warn("Failed to convert {} to Integer", obj);
            return 0;
        }
    }

    private String buildTeacherNotificationMessage(String namaSiswa, String statusPrediksi,
            Double nilaiAkhir, Integer semesterSiswa, Integer jumlahKetidakhadiran, Integer persentaseTugas) {

        return String.format(
                "Siswa %s (Semester %d) memiliki prediksi performa: %s dengan nilai akhir %.2f. " +
                        "Tingkat kehadiran siswa adalah %d ketidakhadiran, dan tingkat penyelesaian tugas sebesar %d%%. "
                        +
                        "Disarankan untuk memantau dan melakukan intervensi akademik jika diperlukan.",
                namaSiswa,
                semesterSiswa,
                statusPrediksi,
                nilaiAkhir,
                jumlahKetidakhadiran,
                persentaseTugas);
    }

    private String buildStudentNotificationMessage(String status) {
        if (status == null)
            return "Hasil prediksi performa Anda telah tersedia.";

        switch (status.trim().toLowerCase()) {
            case "significant increase performance":
                return "Selamat! Performa Anda diprediksi akan meningkat secara signifikan. Terus pertahankan kerja keras Anda!";
            case "stable performance":
                return "Performa Anda diprediksi akan tetap stabil. Cobalah tantangan baru untuk meningkatkan hasil belajar Anda!";
            case "significant decrease performance":
                return "Performa Anda diprediksi akan menurun. Silakan konsultasikan dengan guru atau orang tua untuk bantuan.";
            default:
                return "Hasil prediksi performa Anda telah tersedia.";
        }
    }

    private String buildParentNotificationMessage(String namaSiswa, String status) {
        if (status == null) {
            return String.format("Hasil prediksi performa untuk %s telah tersedia.", namaSiswa);
        }

        switch (status.trim().toLowerCase()) {
            case "significant increase performance":
                return String.format(
                        "Anak Anda, %s, diprediksi akan mengalami peningkatan performa yang signifikan. Terus berikan dukungan dan motivasi!",
                        namaSiswa);
            case "stable performance":
                return String.format(
                        "Anak Anda, %s, diprediksi akan mempertahankan performa yang stabil. Dorong mereka untuk mencoba tantangan baru!",
                        namaSiswa);
            case "significant decrease performance":
                return String.format(
                        "Anak Anda, %s, diprediksi akan mengalami penurunan performa. Silakan berkoordinasi dengan guru untuk strategi pendampingan.",
                        namaSiswa);
            default:
                return String.format("Hasil prediksi performa untuk %s telah tersedia.", namaSiswa);
        }
    }

    private void createAndSaveNotification(Long userId, String title, String message, String type) {
        try {
            Notification notification = new Notification();
            notification.setUserId(userId);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setType(type);
            notification.setIsRead(false);
            notification.setCreatedAt(new Date());
            notification.setUpdatedAt(new Date());
            notificationRepository.save(notification);
        } catch (Exception e) {
            log.error("Failed to save notification for user {}: {}", userId, e.getMessage());
        }
    }

    private List<UserModel> getTeachersOnly() {
        try {
            return userRepository.findAll().stream()
                    .filter(user -> user != null &&
                            user.getRole() != null &&
                            user.getRole().getRole() != null &&
                            user.getRole().getRole().equalsIgnoreCase("TEACHER"))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to get teachers: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}