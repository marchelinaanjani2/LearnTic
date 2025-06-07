package com.example.codingCamp.profile.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.codingCamp.dto.BaseResponseDTO;

import com.example.codingCamp.profile.dto.request.AddUserRequestDTO;
import com.example.codingCamp.profile.dto.request.UpdateUserRequestDTO;
import com.example.codingCamp.profile.dto.response.UserResponseDTO;
import com.example.codingCamp.profile.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    //add one by one
    @PostMapping("/add")
    public ResponseEntity<?> addUser(@Valid @RequestBody AddUserRequestDTO userDTO, BindingResult bindingResult) {
        BaseResponseDTO<UserResponseDTO> baseResponseDTO = new BaseResponseDTO<>();

        // Validasi request
        if (bindingResult.hasFieldErrors()) {
            StringBuilder errorMessages = new StringBuilder();
            List<FieldError> errors = bindingResult.getFieldErrors();
            for (FieldError error : errors) {
                errorMessages.append(error.getDefaultMessage()).append("; ");
            }

            baseResponseDTO.setStatus(HttpStatus.BAD_REQUEST.value());
            baseResponseDTO.setMessage(errorMessages.toString());
            baseResponseDTO.setTimestamp(new Date());
            return new ResponseEntity<>(baseResponseDTO, HttpStatus.BAD_REQUEST);
        }

        try {
            UserResponseDTO newUser = userService.addUser(userDTO);
            baseResponseDTO.setStatus(HttpStatus.CREATED.value());
            baseResponseDTO.setData(newUser);
            baseResponseDTO.setMessage(String.format("User dengan ID %s berhasil ditambahkan", newUser.getId()));
            baseResponseDTO.setTimestamp(new Date());

            return new ResponseEntity<>(baseResponseDTO, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            baseResponseDTO.setStatus(HttpStatus.BAD_REQUEST.value());
            baseResponseDTO.setMessage(e.getMessage());
            baseResponseDTO.setTimestamp(new Date());
            return new ResponseEntity<>(baseResponseDTO, HttpStatus.BAD_REQUEST);
        }
    }

    //add by batch use csv
    @PostMapping("/upload-csv")
    public ResponseEntity<?> uploadUsersCsv(@RequestParam("file") MultipartFile file) {
        BaseResponseDTO<List<UserResponseDTO>> baseResponseDTO = new BaseResponseDTO<>();
        try {
            List<UserResponseDTO> createdUsers = userService.createUsersFromCsv(file);

            baseResponseDTO.setStatus(HttpStatus.CREATED.value());
            baseResponseDTO.setData(createdUsers);
            baseResponseDTO.setMessage(String.format("%d user berhasil ditambahkan dari file CSV", createdUsers.size()));
            baseResponseDTO.setTimestamp(new Date());

            return new ResponseEntity<>(baseResponseDTO, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            baseResponseDTO.setStatus(HttpStatus.BAD_REQUEST.value());
            baseResponseDTO.setMessage(e.getMessage());
            baseResponseDTO.setTimestamp(new Date());
            return new ResponseEntity<>(baseResponseDTO, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            baseResponseDTO.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            baseResponseDTO.setMessage("Terjadi kesalahan pada server");
            baseResponseDTO.setTimestamp(new Date());
            return new ResponseEntity<>(baseResponseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@Valid @RequestBody UpdateUserRequestDTO userDTO, BindingResult bindingResult) {
        BaseResponseDTO<UserResponseDTO> baseResponseDTO = new BaseResponseDTO<>();

        // Validasi request
        if (bindingResult.hasFieldErrors()) {
            StringBuilder errorMessages = new StringBuilder();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errorMessages.append(error.getDefaultMessage()).append("; ");
            }

            baseResponseDTO.setStatus(HttpStatus.BAD_REQUEST.value());
            baseResponseDTO.setMessage(errorMessages.toString());
            baseResponseDTO.setTimestamp(new Date());
            return new ResponseEntity<>(baseResponseDTO, HttpStatus.BAD_REQUEST);
        }

        try {
            UserResponseDTO updatedUser = userService.updateUser(userDTO);
            baseResponseDTO.setStatus(HttpStatus.OK.value());
            baseResponseDTO.setData(updatedUser);
            baseResponseDTO.setMessage(String.format("User dengan ID %s berhasil diperbarui", updatedUser.getId()));
            baseResponseDTO.setTimestamp(new Date());

            return new ResponseEntity<>(baseResponseDTO, HttpStatus.OK);
        } catch (RuntimeException e) {
            baseResponseDTO.setStatus(HttpStatus.BAD_REQUEST.value());
            baseResponseDTO.setMessage(e.getMessage());
            baseResponseDTO.setTimestamp(new Date());
            return new ResponseEntity<>(baseResponseDTO, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("")
    public ResponseEntity<?> detailUser(@RequestParam("id") Long id) {
        BaseResponseDTO<UserResponseDTO> baseResponseDTO = new BaseResponseDTO<>();

        UserResponseDTO user = userService.getUserById(id);
        if (user == null) {
            baseResponseDTO.setStatus(HttpStatus.NOT_FOUND.value());
            baseResponseDTO.setMessage("Data user tidak ditemukan");
            baseResponseDTO.setTimestamp(new Date());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(baseResponseDTO);
        }

        baseResponseDTO.setStatus(HttpStatus.OK.value());
        baseResponseDTO.setData(user);
        baseResponseDTO.setMessage(String.format("User dengan ID %s berhasil ditemukan", user.getId()));
        baseResponseDTO.setTimestamp(new Date());

        return ResponseEntity.ok(baseResponseDTO);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@RequestParam("id") Long id) {
        var baseResponseDTO = new BaseResponseDTO<UserResponseDTO>();

        try {
            UserResponseDTO deletedUser = userService.deleteUser(id);
            baseResponseDTO.setStatus(HttpStatus.OK.value());
            baseResponseDTO.setData(deletedUser);
            baseResponseDTO.setMessage(String.format("User dengan ID %s berhasil dihapus", deletedUser.getId()));
            baseResponseDTO.setTimestamp(new Date());

            return new ResponseEntity<>(baseResponseDTO, HttpStatus.OK);
        } catch (RuntimeException e) {
            baseResponseDTO.setStatus(HttpStatus.BAD_REQUEST.value());
            baseResponseDTO.setMessage(e.getMessage());
            baseResponseDTO.setTimestamp(new Date());
            return new ResponseEntity<>(baseResponseDTO, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/viewall")
    public ResponseEntity<?> viewAllUsers(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String role) {

        var baseResponseDTO = new BaseResponseDTO<List<UserResponseDTO>>();

        try {
            List<UserResponseDTO> users = userService.getAllUsers(id, name, email, role);

            baseResponseDTO.setStatus(HttpStatus.OK.value());
            baseResponseDTO.setData(users);
            baseResponseDTO.setMessage("Daftar user berhasil ditemukan");
            baseResponseDTO.setTimestamp(new Date());

            return new ResponseEntity<>(baseResponseDTO, HttpStatus.OK);
        } catch (Exception e) {
            baseResponseDTO.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            baseResponseDTO.setMessage("Terjadi kesalahan saat mengambil data: " + e.getMessage());
            baseResponseDTO.setTimestamp(new Date());

            return new ResponseEntity<>(baseResponseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
