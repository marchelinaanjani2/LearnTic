package com.example.codingCamp.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.codingCamp.profile.model.Parent;
import com.example.codingCamp.profile.model.Role;
import com.example.codingCamp.profile.model.Student;
import com.example.codingCamp.profile.model.UserModel;

@Repository
public interface UserRepository extends JpaRepository<UserModel, Long> {
    Optional<UserModel> findByUsername(String username);
    UserModel findByEmail(String email);
    Optional<UserModel> findById(Long id);    
    List<UserModel> findAllByRole(Role role);
    Optional<UserModel> findByPhone(String phone);
    
    // PERBAIKAN: Pastikan method ini ada dan benar
    List<UserModel> findByDeletedAtIsNull();
    
    // Alternative jika yang atas tidak work
    @Query("SELECT u FROM UserModel u WHERE u.deletedAt IS NULL")
    List<UserModel> findAllActiveUsers();
    
    @Query("SELECT p FROM Parent p WHERE p.deletedAt IS NULL")
    List<Parent> findAllParents();

    // Cari Student yang orangTuanya punya username tertentu
    @Query("SELECT s FROM Student s WHERE s.orangTua.username = :parentUsername AND s.deletedAt IS NULL")
    Student findStudentByParentUsername(@Param("parentUsername") String parentUsername);
}