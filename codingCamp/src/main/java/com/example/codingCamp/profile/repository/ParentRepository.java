package com.example.codingCamp.profile.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.codingCamp.profile.model.Parent;
import com.example.codingCamp.profile.model.Role;

@Repository
public interface ParentRepository extends JpaRepository<Parent,Long>{
    
}
 