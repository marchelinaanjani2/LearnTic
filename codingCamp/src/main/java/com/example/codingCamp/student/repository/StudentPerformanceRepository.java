package com.example.codingCamp.student.repository;

import java.util.List;
import java.util.Optional;

import com.example.codingCamp.profile.model.Student;
import com.example.codingCamp.student.model.StudentPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Sort;

@Repository
public interface StudentPerformanceRepository extends JpaRepository<StudentPerformance, Long> {
    Optional<StudentPerformance> findTopByStudent_IdAndDeletedAtIsNullOrderByCreatedAtDesc(Long studentId);

    List<StudentPerformance> findAllByDeletedAtIsNullAndStudentIsNotNull();
    Optional<StudentPerformance> findByStudent_Id(Long studentId);
    List<StudentPerformance> findByStudent_Id(Long studentId, Sort sort);

    List<StudentPerformance> findByStudentIn(List<Student> students, Sort sort);
    List<StudentPerformance> findByDeletedAtIsNull(Sort sort);
    List<StudentPerformance> findByStudent_IdAndDeletedAtIsNull(Long studentId, Sort sort);
    List<StudentPerformance> findByStudentInAndDeletedAtIsNull(List<Student> students, Sort sort);
}
