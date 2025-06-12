package com.example.codingCamp.student.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.codingCamp.student.dto.request.CreateStudentPerformanceRequestDTO;
import com.example.codingCamp.student.dto.request.UpdateStudentPerformanceRequestDTO;
import com.example.codingCamp.student.dto.response.StudentPerformanceResponseDTO;
import com.example.codingCamp.student.model.StudentPerformance;

public interface StudentPerformanceService {
    StudentPerformanceResponseDTO createPerformance(CreateStudentPerformanceRequestDTO request);
    StudentPerformanceResponseDTO updatePerformance(Long id, UpdateStudentPerformanceRequestDTO request);
    List<StudentPerformanceResponseDTO> getAllPerformance(String sortBy);
    StudentPerformanceResponseDTO getPerformanceByStudentId(Long id);
    void deletePerformanceByStudentId(Long id);
    List<StudentPerformanceResponseDTO> createBulkPerformance(List<CreateStudentPerformanceRequestDTO> requestList);
    List<StudentPerformanceResponseDTO> importFromCSV(MultipartFile file);
    void validateCSVFormat(MultipartFile file);



}
