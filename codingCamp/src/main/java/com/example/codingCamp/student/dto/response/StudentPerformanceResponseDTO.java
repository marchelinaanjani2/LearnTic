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
public class StudentPerformanceResponseDTO {
    private Long id;
    private Long siswaId;
    private String namaSiswa;

    private Map<String, Integer> nilaiUjianPerMapel;
    private Map<String, Integer> nilaiTugasPerMapel;
    private Map<String, Integer> nilaiKuisPerMapel;

    private Integer rataRataNilaiAkhir;

    private Integer jumlahKetidakhadiran;
    private Integer persentaseTugas;
    private String semester;

    private String statusPrediksi;
    

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date deletedAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date updatedAt;
}
