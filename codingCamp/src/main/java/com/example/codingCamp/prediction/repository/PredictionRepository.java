package com.example.codingCamp.prediction.repository;



import com.example.codingCamp.prediction.model.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByStatusPrediksiAndDeletedAtIsNull(String status);
}
