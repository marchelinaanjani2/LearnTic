package com.example.codingCamp.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.codingCamp.profile.model.Parent;
import com.example.codingCamp.profile.model.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    @Query("SELECT f FROM Student f WHERE " +
            "(LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(f.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(f.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND f.deletedAt IS NULL")
    List<Student> searchByNameEmailOrPhone(@Param("keyword") String keyword);

    List<Student> findByDeletedAtIsNull();
    List<Student> findByOrangTua(Parent parent);
    Optional<Student> findByName(String name);

    @EntityGraph(attributePaths = "daftarNilai")
    Optional<Student> findWithDaftarNilaiById(Long id);

}
