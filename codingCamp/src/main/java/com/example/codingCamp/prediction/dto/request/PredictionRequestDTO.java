package com.example.codingCamp.prediction.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequestDTO {
    private Long siswaId;
    private String semester;
    private Integer rataRataNilaiAkhir;
    private Integer jumlahKetidakhadiran;
    private Integer persentaseTugas;
}