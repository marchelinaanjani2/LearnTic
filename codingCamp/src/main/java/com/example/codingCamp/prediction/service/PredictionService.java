package com.example.codingCamp.prediction.service;

import java.util.List;

import com.example.codingCamp.prediction.dto.response.PredictionResponseDTO;

public interface PredictionService {
    PredictionResponseDTO predict(Long siswaId);
    List<PredictionResponseDTO> predictBatch();
}
