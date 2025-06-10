package com.example.codingCamp.prediction.service;

import com.example.codingCamp.notification.service.NotificationService;
import com.example.codingCamp.prediction.dto.response.PredictionResponseDTO;
import com.example.codingCamp.prediction.model.Prediction;
import com.example.codingCamp.prediction.repository.PredictionRepository;
import com.example.codingCamp.profile.model.Student;
import com.example.codingCamp.profile.repository.StudentRepository;
import com.example.codingCamp.student.model.StudentPerformance;
import com.example.codingCamp.student.repository.StudentPerformanceRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PredictionServiceImpl implements PredictionService {

    private enum PredictionStatus {
        SIGNIFICANT_INCREASE("Significant Increase Performance"),
        STABLE("Stable Performance"),
        SIGNIFICANT_DECREASE("Significant Decrease Performance");

        private final String displayName;

        PredictionStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }

        public static PredictionStatus fromString(String text) {
            for (PredictionStatus status : PredictionStatus.values()) {
                if (status.displayName.equalsIgnoreCase(text)) {
                    return status;
                }
            }
            return STABLE; // Default value if not matched
        }
    }

    private final StudentPerformanceRepository performanceRepository;
    private final StudentRepository studentRepository;
    private final PredictionRepository predictionRepository;
    private final RestTemplate restTemplate;
    @Autowired
    private NotificationService notificationService;

    // Update the URL to include the correct endpoint
    @Value("${flask.api.url:https://learntic-production.up.railway.app/predict}")
    private String flaskApiUrl;

    @Override
    public PredictionResponseDTO predict(Long siswaId) {
        log.info("Starting prediction for student ID: {}", siswaId);

        // Validasi input
        if (siswaId == null || siswaId <= 0) {
            throw new IllegalArgumentException("ID siswa tidak valid");
        }

        // Ambil data performa terbaru
        StudentPerformance performance = performanceRepository
                .findTopByStudent_IdAndDeletedAtIsNullOrderByCreatedAtDesc(siswaId)
                .orElseThrow(
                        () -> new RuntimeException("Data performa siswa dengan ID " + siswaId + " tidak ditemukan"));

        // Ambil data siswa
        Student siswa = studentRepository.findById(siswaId)
                .orElseThrow(() -> new RuntimeException("Siswa dengan ID " + siswaId + " tidak ditemukan"));

        // Validasi data performa
        validatePerformanceData(performance);

        // Buat prediksi
        PredictionStatus predictionStatus = callFlaskPredictionApi(performance);

        // Simpan hasil prediksi
        Prediction prediction = buildPrediction(siswa, performance, predictionStatus);
        predictionRepository.save(prediction);

        // kirim notif
        notificationService.sendPredictionNotificationToStudent(prediction, siswa.getId());

        // Kirim notifikasi ke parent
        if (siswa.getOrangTua() != null) {
            notificationService.sendPredictionNotificationToParent(prediction, siswa.getOrangTua().getId());
        }

        // Kirim notifikasi ke semua guru
        notificationService.sendPredictionNotificationToTeachers(prediction);

        log.info("Prediction completed for student ID: {} with status: {}", siswaId, predictionStatus.getDisplayName());
        return toPredictionResponseDTO(prediction);
    }

    @Override
    public List<PredictionResponseDTO> predictBatch() {
        log.info("Starting batch prediction");

        List<StudentPerformance> allPerformances = performanceRepository
                .findAllByDeletedAtIsNullAndStudentIsNotNull();

        if (allPerformances.isEmpty()) {
            log.warn("No performance data found for batch prediction");
            return new ArrayList<>();
        }

        List<PredictionResponseDTO> results = new ArrayList<>();
        int successCount = 0;
        int failCount = 0;

        for (StudentPerformance performance : allPerformances) {
            try {
                Student siswa = performance.getStudent();
                if (siswa == null) {
                    log.warn("Performance data found without student reference, skipping");
                    continue;
                }

                validatePerformanceData(performance);
                PredictionStatus predictionStatus = callFlaskPredictionApi(performance);

                Prediction prediction = buildPrediction(siswa, performance, predictionStatus);
                predictionRepository.save(prediction);
                // kirim notif
                notificationService.sendPredictionNotificationToStudent(prediction, siswa.getId());

                // Kirim notifikasi ke parent
                if (siswa.getOrangTua() != null) {
                    notificationService.sendPredictionNotificationToParent(prediction, siswa.getOrangTua().getId());
                }

                // Kirim notifikasi ke semua guru
                notificationService.sendPredictionNotificationToTeachers(prediction);

                results.add(toPredictionResponseDTO(prediction));
                successCount++;

                // Add a small delay to avoid overwhelming the API
                Thread.sleep(100);

            } catch (Exception e) {
                log.error("Failed to predict for student ID: {}, error: {}",
                        performance.getStudent() != null ? performance.getStudent().getId() : "unknown",
                        e.getMessage());
                failCount++;

                // Continue with other students instead of failing completely
                continue;
            }
        }

        log.info("Batch prediction completed. Success: {}, Failed: {}", successCount, failCount);

        if (results.isEmpty() && failCount > 0) {
            throw new RuntimeException("Semua prediksi gagal. Periksa koneksi ke layanan prediksi.");
        }

        return results;
    }

    @Override
    public List<Prediction> getPredictionsByStatus(String status) {
        return predictionRepository.findByStatusPrediksiAndDeletedAtIsNull(status);
    }


    @Override
    public void deletePrediction(Long id) {
        Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Prediction not found with id: " + id));
        
        prediction.setDeletedAt(new Date()); // Soft delete
        predictionRepository.save(prediction);
    }
    

    private void validatePerformanceData(StudentPerformance performance) {
        if (performance.getNilaiAkhirRataRata() == null ||
                performance.getJumlahKetidakhadiran() == null ||
                performance.getPersentaseTugas() == null) {
            throw new RuntimeException("Data performa tidak lengkap");
        }

        if (performance.getNilaiAkhirRataRata() < 0 || performance.getNilaiAkhirRataRata() > 100) {
            throw new RuntimeException("Nilai akhir rata-rata tidak valid (harus 0-100)");
        }

        if (performance.getJumlahKetidakhadiran() < 0) {
            throw new RuntimeException("Jumlah Ketidakhadiran tidak valid");
        }

        if (performance.getPersentaseTugas() < 0 || performance.getPersentaseTugas() > 100) {
            throw new RuntimeException("Persentase tugas tidak valid (harus 0-100)");
        }
    }

    private PredictionStatus callFlaskPredictionApi(StudentPerformance performance) {
        try {
            log.info("Calling Flask API at: {}", flaskApiUrl);

            // Prepare payload dengan validasi tambahan
            Map<String, Object> payload = new HashMap<>();

            // Pastikan persentaseTugas dalam rentang 0-100
            Integer persentaseTugas = performance.getPersentaseTugas();
            if (persentaseTugas < 0 || persentaseTugas > 100) {
                throw new RuntimeException("Persentase tugas harus dalam rentang 0-100, nilai: " + persentaseTugas);
            }

            payload.put("Persentase Tugas", persentaseTugas);
            payload.put("Jumlah Ketidakhadiran", performance.getJumlahKetidakhadiran());
            payload.put("Rata-rata", performance.getNilaiAkhirRataRata());

            log.info("Sending payload: {}", payload);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            // Make API call
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    flaskApiUrl,
                    entity,
                    Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();

                // Cek apakah ada error dari Flask API
                if (responseBody.containsKey("error")) {
                    String errorMsg = responseBody.get("error").toString();
                    log.warn("Flask API returned error: {}, using fallback prediction", errorMsg);
                    return calculateFallbackPrediction(performance);

                }

                // Cek apakah ada prediction
                Object predictionObj = responseBody.getOrDefault("prediction", responseBody.get("predicted_label"));
                if (predictionObj != null) {
                    String apiResult = predictionObj.toString();
                    log.info("API Response successful: {}", apiResult);
                    return PredictionStatus.fromString(apiResult);
                } else {
                    log.warn("API response missing prediction field: {}", responseBody);
                    log.warn("Available response keys: {}", responseBody.keySet());
                    return calculateFallbackPrediction(performance);
                }

            } else {
                log.error("API returned unsuccessful response: {} - {}",
                        response.getStatusCode(), response.getBody());
                throw new RuntimeException("API returned " + response.getStatusCode());
            }

        } catch (RestClientException e) {
            log.error("REST Client Exception: {}", e.getMessage());

            if (e.getMessage().contains("404")) {
                throw new RuntimeException(
                        "Flask prediction service endpoint not found. Please check the URL configuration.");
            } else if (e.getMessage().contains("Connection refused") || e.getMessage().contains("timeout")) {
                throw new RuntimeException("Cannot connect to Flask prediction service. Service may be down.");
            }

            throw new RuntimeException("Prediction service unavailable: " + e.getMessage());
        } catch (RuntimeException e) {
            // Re-throw runtime exceptions (including our custom ones)
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error calling Flask API: {}", e.getMessage());
            throw new RuntimeException("Prediction service error: " + e.getMessage());
        }
    }

    private PredictionStatus calculateFallbackPrediction(StudentPerformance performance) {
        // Simple rule-based prediction
        int score = (int) Math.round(
                (performance.getNilaiAkhirRataRata() * 0.5) +
                        (performance.getPersentaseTugas() * 0.3) +
                        (performance.getJumlahKetidakhadiran() * 0.2));

        if (score >= 80)
            return PredictionStatus.SIGNIFICANT_INCREASE;
        if (score >= 60)
            return PredictionStatus.STABLE;
        return PredictionStatus.SIGNIFICANT_DECREASE;
    }

    private Prediction buildPrediction(Student siswa, StudentPerformance performance, PredictionStatus status) {
        return Prediction.builder()
                .siswaId(siswa.getId())
                .namaSiswa(siswa.getName())
                .semesterSiswa(performance.getSemester())
                .nilaiAkhir(performance.getNilaiAkhirRataRata())
                .jumlahKetidakhadiran(performance.getJumlahKetidakhadiran())
                .persentaseTugas(performance.getPersentaseTugas())
                .statusPrediksi(status.getDisplayName())
                .createdAt(new Date())
                .build();
    }

    // // Method untuk test Flask API secara manual
    // public void testFlaskApi() {
    // try {
    // log.info("Testing Flask API connection...");

    // // Test dengan data sample
    // Map<String, Object> testPayload = new HashMap<>();
    // testPayload.put("persentase Tugas", 75.0);
    // testPayload.put("jumlah Ketidakhadiran", 20);
    // testPayload.put("Rata-rata", 80.0);

    // HttpHeaders headers = new HttpHeaders();
    // headers.setContentType(MediaType.APPLICATION_JSON);
    // headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

    // HttpEntity<Map<String, Object>> entity = new HttpEntity<>(testPayload,
    // headers);

    // log.info("Sending test payload: {}", testPayload);

    // ResponseEntity<String> response = restTemplate.postForEntity(
    // flaskApiUrl,
    // entity,
    // String.class);

    // log.info("Raw API Response Status: {}", response.getStatusCode());
    // log.info("Raw API Response Body: {}", response.getBody());
    // log.info("Raw API Response Headers: {}", response.getHeaders());

    // } catch (Exception e) {
    // log.error("Flask API test failed: {}", e.getMessage(), e);
    // }
    // }

    private PredictionResponseDTO toPredictionResponseDTO(Prediction prediction) {
        return PredictionResponseDTO.builder()
                .predictionId(prediction.getId())
                .siswaId(prediction.getSiswaId())
                .namaSiswa(prediction.getNamaSiswa())
                .semesterSiswa(prediction.getSemesterSiswa())
                .nilaiAkhir(prediction.getNilaiAkhir())
                .jumlahKetidakhadiran(prediction.getJumlahKetidakhadiran())
                .persentaseTugas(prediction.getPersentaseTugas())
                .statusPrediksi(prediction.getStatusPrediksi())
                .build();
    }
}