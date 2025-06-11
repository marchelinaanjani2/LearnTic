package com.example.codingCamp.prediction.repository;

import com.example.codingCamp.prediction.model.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByStatusPrediksiAndDeletedAtIsNull(String status);

    List<Prediction> findAllByDeletedAtIsNull(Sort sort);

    List<Prediction> findBySiswaIdAndDeletedAtIsNull(Long siswaId, Sort sort);

    List<Prediction> findBySiswaIdInAndDeletedAtIsNull(List<Long> siswaIds, Sort sort);

}
