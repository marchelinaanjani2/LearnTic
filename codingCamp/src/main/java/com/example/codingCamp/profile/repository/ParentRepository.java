package com.example.codingCamp.profile.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.codingCamp.profile.model.Parent;
import com.example.codingCamp.profile.model.Role;

@Repository
public interface ParentRepository extends JpaRepository<Parent,Long>{
    @Query("SELECT p FROM Parent p LEFT JOIN FETCH p.anak WHERE p.id = :id")
    Optional<Parent> findByIdWithAnak(@Param("id") Long id);
}
 