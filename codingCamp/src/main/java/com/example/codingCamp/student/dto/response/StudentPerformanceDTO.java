package com.example.codingCamp.student.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentPerformanceDTO {
    private Map<String, Integer> nilaiUjian;
    private Map<String, Integer> nilaiTugas;
    private Map<String, Integer> nilaiKuis;
    private Integer jumlahKetidakhadiran;
    private Integer persentaseTugas;
    private String semester;
    private Integer nilaiAkhirRataRata;
    private String statusPrediksi;
}
