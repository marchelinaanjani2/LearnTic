package com.example.codingCamp.student.model;

import com.example.codingCamp.profile.model.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_performance")
public class StudentPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student; 

    @ElementCollection
    @CollectionTable(name = "nilai_ujian_per_mapel", joinColumns = @JoinColumn(name = "student_performance_id"))
    @MapKeyColumn(name = "mata_pelajaran")
    @Column(name = "nilai_ujian")
    private Map<String, Integer> nilaiUjianPerMapel;

    @ElementCollection
    @CollectionTable(name = "nilai_tugas_per_mapel", joinColumns = @JoinColumn(name = "student_performance_id"))
    @MapKeyColumn(name = "mata_pelajaran")
    @Column(name = "nilai_tugas")
    private Map<String, Integer> nilaiTugasPerMapel;

    @ElementCollection
    @CollectionTable(name = "nilai_kuis_per_mapel", joinColumns = @JoinColumn(name = "student_performance_id"))
    @MapKeyColumn(name = "mata_pelajaran")
    @Column(name = "nilai_kuis")
    private Map<String, Integer> nilaiKuisPerMapel;

    private Integer jumlahKetidakhadiran;
    private Integer persentaseTugas;

    private Integer nilaiAkhirRataRata;
    private String semester;

    private Boolean submittedForPrediction = false;

    private String statusPrediksi;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "deleted_at")
    private Date deletedAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;
}
