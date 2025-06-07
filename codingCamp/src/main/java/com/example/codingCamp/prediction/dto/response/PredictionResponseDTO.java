package com.example.codingCamp.prediction.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResponseDTO {
    private Long predictionId;
    private Long siswaId;
    private String semesterSiswa;
    private String namaSiswa;
    private Integer nilaiAkhir;
    private Integer jumlahKetidakhadiran;
    private Integer persentaseTugas;
    private String statusPrediksi;
}