package com.example.codingCamp.profile.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import com.example.codingCamp.profile.dto.request.AddUserRequestDTO;
import com.example.codingCamp.profile.dto.request.UpdateUserRequestDTO;
import com.example.codingCamp.profile.dto.response.StudentDetailDTO;
import com.example.codingCamp.profile.dto.response.TeacherResponseDTO;
import com.example.codingCamp.profile.dto.response.UserResponseDTO;
import com.example.codingCamp.profile.model.UserModel;

public interface UserService {
    UserModel findUserByUsername(String username);
    UserModel findUserByEmail(String email);
    UserModel findUserByEmailOrUsername(String emailOrUsername);
    String hashPassword(String password);
    boolean matchesPassword(String rawPassword, String hashedPassword);
    UserResponseDTO addUser(AddUserRequestDTO userDTO);
    UserResponseDTO updateUser(UpdateUserRequestDTO userDTO);
    UserResponseDTO getUserById(Long id);
    UserResponseDTO deleteUser(Long userId);
    List<UserResponseDTO> getAllUsers(Long id, String name, String email, String role);
    // // List<TeacherResponseDTO> getAllTeachers();
    List<StudentDetailDTO> getAllStudent(String search);
    UserResponseDTO getStudentById(Long id);
    List<UserResponseDTO> createUsersFromCsv(MultipartFile file) throws IOException;
}
