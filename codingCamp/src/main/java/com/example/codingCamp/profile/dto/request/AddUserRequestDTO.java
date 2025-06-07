
package com.example.codingCamp.profile.dto.request; 

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddUserRequestDTO {
    
    @NotEmpty(message = "Nama tidak boleh kosong")
    @Size(max = 50, message = "Nama maksimal 50 karakter")
    private String name;

    @NotEmpty(message = "Username tidak boleh kosong")
    @Size(max = 30, message = "Username maksimal 30 karakter")
    private String username;

    @NotEmpty(message = "Email tidak boleh kosong")
    @Email(message = "Format email tidak valid")
    private String email;

    @NotEmpty(message = "Nomor telepon tidak boleh kosong")
    @Size(max = 15, message = "Nomor telepon maksimal 15 karakter")
    private String phone;

    @NotEmpty(message = "Password tidak boleh kosong")
    @Size(min = 6, message = "Password minimal 6 karakter")
    private String password;

    @NotEmpty(message = "Role tidak boleh kosong")
    private String roleName; // Ubah dari roleId ke roleName

    private String kelas;
    private String orangTuaUsername; 
}

