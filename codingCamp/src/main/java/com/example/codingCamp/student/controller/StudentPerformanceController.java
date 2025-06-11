package com.example.codingCamp.student.controller;

import com.example.codingCamp.dto.BaseResponseDTO;
import com.example.codingCamp.student.dto.request.CreateStudentPerformanceRequestDTO;
import com.example.codingCamp.student.dto.request.UpdateStudentPerformanceRequestDTO;
import com.example.codingCamp.student.dto.response.StudentPerformanceResponseDTO;
import com.example.codingCamp.student.service.StudentPerformanceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/student-performance")
public class StudentPerformanceController {

        @Autowired
        private StudentPerformanceService studentPerformanceService;

        @PostMapping("/create")
        public BaseResponseDTO<StudentPerformanceResponseDTO> createPerformance(
                        @RequestBody CreateStudentPerformanceRequestDTO request) {
                StudentPerformanceResponseDTO response = studentPerformanceService.createPerformance(request);

                return BaseResponseDTO.<StudentPerformanceResponseDTO>builder()
                                .data(response)
                                .status(HttpStatus.OK.value())
                                .message("Data performa siswa dengan ID " + response.getSiswaId() + " berhasil dibuat")
                                .timestamp(new Date())
                                .build();
        }

        @PutMapping("/{id}/update")
        public BaseResponseDTO<StudentPerformanceResponseDTO> updatePerformacne(@PathVariable Long id,
                        @RequestBody UpdateStudentPerformanceRequestDTO request) {
                StudentPerformanceResponseDTO studentPerformanceResponse = studentPerformanceService.updatePerformance(
                                id,
                                request);
                return BaseResponseDTO.<StudentPerformanceResponseDTO>builder()
                                .data(studentPerformanceResponse)
                                .status(HttpStatus.OK.value())
                                .message("Student Performance dengan id " + studentPerformanceResponse.getId()
                                                + " berhasil diperbarui")
                                .timestamp(new Date())
                                .build();
        }

        @GetMapping("/viewall")
        public ResponseEntity<BaseResponseDTO<List<StudentPerformanceResponseDTO>>> listPerformance(
                        @RequestParam(required = false) String sortBy) {
                List<StudentPerformanceResponseDTO> listStudentPerformance = studentPerformanceService
                                .getAllPerformance(sortBy);
                BaseResponseDTO<List<StudentPerformanceResponseDTO>> response = BaseResponseDTO
                                .<List<StudentPerformanceResponseDTO>>builder()
                                .data(listStudentPerformance)
                                .status(HttpStatus.OK.value())
                                .message("List Student Performance berhasil diambil")
                                .timestamp(new Date())
                                .build();

                return ResponseEntity.ok(response);
        }

        @GetMapping("/detail/{id}")
        public ResponseEntity<BaseResponseDTO<StudentPerformanceResponseDTO>> detailPerformance(
                        @PathVariable("id") Long id) {
                StudentPerformanceResponseDTO studentPerformance = studentPerformanceService.getPerformanceByStudentId(id);
                if (studentPerformance == null) {
                        BaseResponseDTO<StudentPerformanceResponseDTO> errorResponse = BaseResponseDTO
                                        .<StudentPerformanceResponseDTO>builder()
                                        .status(HttpStatus.NOT_FOUND.value())
                                        .message("Data Student Performance tidak ditemukan")
                                        .timestamp(new Date())
                                        .build();

                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
                }

                BaseResponseDTO<StudentPerformanceResponseDTO> response = BaseResponseDTO
                                .<StudentPerformanceResponseDTO>builder()
                                .data(studentPerformance)
                                .status(HttpStatus.OK.value())
                                .message(String.format("Student Performance dengan ID %s berhasil ditemukan", id))
                                .timestamp(new Date())
                                .build();

                return ResponseEntity.ok(response);
        }

        @DeleteMapping("/delete/{id}")
        public BaseResponseDTO<Void> deletePerformance(@PathVariable Long id) {
                studentPerformanceService.deletePerformance(id);
                return BaseResponseDTO.<Void>builder()
                                .status(HttpStatus.OK.value())
                                .message("Student Performance dengan id " + id + " berhasil dicancel")
                                .timestamp(new Date())
                                .build();
        }

        @PostMapping("/upload-csv")
        public BaseResponseDTO<List<StudentPerformanceResponseDTO>> uploadCSV(
                        @RequestParam("file") MultipartFile file) {
                if (file.isEmpty()) {
                        return BaseResponseDTO.<List<StudentPerformanceResponseDTO>>builder()
                                        .status(HttpStatus.BAD_REQUEST.value())
                                        .message("File CSV kosong")
                                        .timestamp(new Date())
                                        .build();
                }

                try {
                        // Validate CSV format
                        studentPerformanceService.validateCSVFormat(file);

                        // Import data
                        List<StudentPerformanceResponseDTO> result = studentPerformanceService.importFromCSV(file);

                        return BaseResponseDTO.<List<StudentPerformanceResponseDTO>>builder()
                                        .data(result)
                                        .status(HttpStatus.OK.value())
                                        .message("Data berhasil diimpor sebanyak " + result.size() + " baris")
                                        .timestamp(new Date())
                                        .build();

                } catch (RuntimeException e) {
                        e.printStackTrace();
                        return BaseResponseDTO.<List<StudentPerformanceResponseDTO>>builder()
                                        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                        .message("Gagal memproses file: " + e.getMessage())
                                        .timestamp(new Date())
                                        .build();
                }
        }

}
