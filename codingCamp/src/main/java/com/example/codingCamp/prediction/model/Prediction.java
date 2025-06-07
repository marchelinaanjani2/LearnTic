package com.example.codingCamp.prediction.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "prediction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "siswa_id", nullable = false)
    private Long siswaId;

    @Column(name = "nama_siswa")
    private String namaSiswa;

    @Column(name = "semester_siswa")
    private String semesterSiswa;

    @Column(name = "nilai_akhir")
    private Integer nilaiAkhir;

    @Column(name = "jumlah_Ketidakhadiran")
    private Integer jumlahKetidakhadiran;

    @Column(name = "persentase_tugas")
    private Integer persentaseTugas;

    @Column(name = "status_prediksi")
    private String statusPrediksi;

    @Temporal(TemporalType.DATE)
    @Column(name = "created_at")
    private Date createdAt;

    @Temporal(TemporalType.DATE)
    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "deleted_at")
    private Date deletedAt;
}