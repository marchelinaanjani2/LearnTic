package com.example.codingCamp.student.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateStudentPerformanceRequestDTO {

    @NotNull(message = "siswaId tidak boleh null")
    private Long siswaId;

    private Map<String, Integer> nilaiUjianPerMapel;
    private Map<String, Integer> nilaiTugasPerMapel;
    private Map<String, Integer> nilaiKuisPerMapel;

    private Integer jumlahKetidakhadiran;
    private Integer persentaseTugas;
    private String semester;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date deletedAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date updatedAt;
}
