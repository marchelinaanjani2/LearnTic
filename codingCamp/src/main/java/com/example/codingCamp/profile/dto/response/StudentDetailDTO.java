package com.example.codingCamp.profile.dto.response;

import com.example.codingCamp.student.dto.response.StudentPerformanceDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class StudentDetailDTO extends UserResponseDTO {
    private List<StudentPerformanceDTO> daftarNilai;
    private String kelas;


    public StudentDetailDTO(Long id, String name, String username, String email,
                            String phone, String role, Date createdAt, Date updatedAt,
                            List<StudentPerformanceDTO> daftarNilai, String kelas) {
        super(id, name, username, email, phone, role, createdAt, updatedAt);
        this.daftarNilai = daftarNilai;
        this.kelas = kelas;

        
    }
}
