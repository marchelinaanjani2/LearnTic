package com.example.codingCamp.prediction.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.codingCamp.dto.BaseResponseDTO;
import com.example.codingCamp.prediction.dto.response.PredictionResponseDTO;
import com.example.codingCamp.prediction.model.Prediction;
import com.example.codingCamp.prediction.service.PredictionService;
import com.example.codingCamp.student.dto.response.StudentPerformanceResponseDTO;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/prediction")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    // Endpoint untuk prediksi batch - GET lebih sesuai karena hanya mengambil data
    @GetMapping("/batch")
    public ResponseEntity<BaseResponseDTO<List<PredictionResponseDTO>>> predictBatch() {
        BaseResponseDTO<List<PredictionResponseDTO>> responseDTO = new BaseResponseDTO<>();
        try {
            List<PredictionResponseDTO> results = predictionService.predictBatch();
            responseDTO.setStatus(HttpStatus.OK.value());
            responseDTO.setMessage("Berhasil memprediksi performa seluruh siswa");
            responseDTO.setTimestamp(new Date());
            responseDTO.setData(results);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            responseDTO.setStatus(HttpStatus.BAD_REQUEST.value());
            responseDTO.setMessage("Gagal melakukan prediksi batch: " + e.getMessage());
            responseDTO.setTimestamp(new Date());
            return ResponseEntity.badRequest().body(responseDTO);
        } catch (Exception e) {
            responseDTO.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            responseDTO.setMessage("Terjadi kesalahan sistem saat melakukan prediksi batch");
            responseDTO.setTimestamp(new Date());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDTO);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<List<Prediction>> getPredictionsByStatus(@RequestParam String status) {
        return ResponseEntity.ok(predictionService.getPredictionsByStatus(status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrediction(@PathVariable Long id) {
        predictionService.deletePrediction(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/viewall")
    public ResponseEntity<BaseResponseDTO<List<PredictionResponseDTO>>> listPrediction(
            @RequestParam(required = false) String sortBy) {
        List<PredictionResponseDTO> listPredictions = predictionService
                .getAllPredictions(sortBy);
        BaseResponseDTO<List<PredictionResponseDTO>> response = BaseResponseDTO
                .<List<PredictionResponseDTO>>builder()
                .data(listPredictions)
                .status(HttpStatus.OK.value())
                .message("List Prediction berhasil diambil")
                .timestamp(new Date())
                .build();

        return ResponseEntity.ok(response);
    }

    // Endpoint untuk prediksi individual
    @GetMapping("/{siswaId}")
    public ResponseEntity<BaseResponseDTO<PredictionResponseDTO>> predict(@PathVariable Long siswaId) {
        BaseResponseDTO<PredictionResponseDTO> responseDTO = new BaseResponseDTO<>();
        try {
            // Validasi input
            if (siswaId == null || siswaId <= 0) {
                responseDTO.setStatus(HttpStatus.BAD_REQUEST.value());
                responseDTO.setMessage("ID siswa tidak valid");
                responseDTO.setTimestamp(new Date());
                return ResponseEntity.badRequest().body(responseDTO);
            }

            PredictionResponseDTO result = predictionService.predict(siswaId);
            responseDTO.setStatus(HttpStatus.OK.value());
            responseDTO.setMessage("Berhasil memprediksi performa siswa");
            responseDTO.setTimestamp(new Date());
            responseDTO.setData(result);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            responseDTO.setStatus(HttpStatus.BAD_REQUEST.value());
            responseDTO.setMessage("Gagal memprediksi performa siswa: " + e.getMessage());
            responseDTO.setTimestamp(new Date());
            return ResponseEntity.badRequest().body(responseDTO);
        } catch (Exception e) {
            responseDTO.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            responseDTO.setMessage("Terjadi kesalahan sistem saat memprediksi performa siswa");
            responseDTO.setTimestamp(new Date());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDTO);
        }
    }
}