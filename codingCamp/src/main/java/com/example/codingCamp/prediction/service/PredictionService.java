package com.example.codingCamp.prediction.service;

import java.util.List;

import com.example.codingCamp.prediction.dto.response.PredictionResponseDTO;
import com.example.codingCamp.prediction.model.Prediction;

public interface PredictionService {
    PredictionResponseDTO predict(Long siswaId);
    List<PredictionResponseDTO> predictBatch();
    List<Prediction> getPredictionsByStatus(String status);
    void deletePrediction(Long id);

}
