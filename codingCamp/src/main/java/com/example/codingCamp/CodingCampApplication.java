package com.example.codingCamp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import jakarta.transaction.Transactional;

import java.util.Collections;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import com.example.codingCamp.profile.model.Student;
import com.example.codingCamp.profile.model.Teacher;
import com.example.codingCamp.profile.model.Parent;
import com.example.codingCamp.profile.model.Role;
import com.example.codingCamp.profile.model.UserModel;
import com.example.codingCamp.profile.repository.RoleRepository;
import com.example.codingCamp.profile.repository.UserRepository;
import com.example.codingCamp.profile.service.UserService;

@SpringBootApplication
@EnableAsync
public class CodingCampApplication {

	public static void main(String[] args) {
		System.out.println("DATABASE_URL = " + System.getenv("DATABASE_URL"));
		SpringApplication.run(CodingCampApplication.class, args);
	}

	@Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
	
	@Bean
	CommandLineRunner run(
			RoleRepository roleRepository,
			UserRepository userRepository,
			UserService userService) {
		return args -> {
			try {
				// SUPER_ADMIN role
				if (roleRepository.findByRole("ADMIN").isEmpty()) {
					Role role = new Role();
					role.setRole("ADMIN");
					roleRepository.save(role);
					System.out.println("✓ ADMIN role created");
				}

				if (userRepository.findByUsername("admin_budi").isEmpty()) { // Ubah dari == null ke isEmpty()
					UserModel user = new UserModel();
					user.setName("Admin Budi");
					user.setUsername("admin_budi");
					user.setEmail("bprasetyo21@outlook.com");
					user.setPhone("081234567890");
					user.setPassword(userService.hashPassword("budi"));
					user.setRole(roleRepository.findByRole("ADMIN").orElse(null));
					userRepository.save(user);
					System.out.println("✓ Admin user created");
				}

				// STUDENT role
				if (roleRepository.findByRole("STUDENT").isEmpty()) {
					Role role = new Role();
					role.setRole("STUDENT");
					roleRepository.save(role);
					System.out.println("✓ STUDENT role created");
				}

				if (userRepository.findByUsername("student_rini").isEmpty()) { // Ubah dari == null ke isEmpty()
					Student student = new Student();
					student.setName("Rini Student");
					student.setUsername("student_rini");
					student.setEmail("rini.student@example.com");
					student.setPhone("081234567895");
					student.setPassword(userService.hashPassword("rini!"));
					student.setRole(roleRepository.findByRole("STUDENT").orElse(null));
					student.setKelas("XI");
					userRepository.save(student);
					System.out.println("✓ Student user created");
				}

				// TEACHER role
				if (roleRepository.findByRole("TEACHER").isEmpty()) {
					Role role = new Role();
					role.setRole("TEACHER");
					roleRepository.save(role);
					System.out.println("✓ TEACHER role created");
				}

				if (userRepository.findByUsername("teacher_budi").isEmpty()) { // Ubah dari == null ke isEmpty()
					Teacher teacher = new Teacher();
					teacher.setName("Budi Teacher");
					teacher.setUsername("teacher_budi");
					teacher.setEmail("budi.teacher@example.com");
					teacher.setPhone("081234567896");
					teacher.setPassword(userService.hashPassword("teacher"));
					teacher.setRole(roleRepository.findByRole("TEACHER").orElse(null));
					userRepository.save(teacher);
					System.out.println("✓ Teacher user created");
				}

				// PARENT role
				if (roleRepository.findByRole("PARENT").isEmpty()) {
					Role role = new Role();
					role.setRole("PARENT");
					roleRepository.save(role);
					System.out.println("✓ PARENT role created");
				}

				if (userRepository.findByUsername("parent_ani").isEmpty()) { // Ubah dari == null ke isEmpty()
					Parent parent = new Parent();
					parent.setName("Ani Parent");
					parent.setUsername("parent_ani");
					parent.setEmail("ani.parent@example.com");
					parent.setPhone("081234567897");
					parent.setPassword(userService.hashPassword("parentani"));
					parent.setRole(roleRepository.findByRole("PARENT").orElse(null));

					Student anak = (Student) userRepository.findByUsername("student_rini").orElse(null);
					if (anak != null) {
						parent.setAnak(Collections.singletonList(anak));
						userRepository.save(parent);

						// Update student dengan parent-nya
						anak.setOrangTua(parent);
						userRepository.save(anak);
						System.out.println("✓ Parent user created with child relationship");
					} else {
						System.out.println("Warning: Student 'student_rini' not found, creating parent without child");
						userRepository.save(parent);
					}
				}

				System.out.println("=== SEEDER COMPLETED SUCCESSFULLY ===");

			} catch (Exception e) {
				System.err.println("ERROR in seeder: " + e.getMessage());
				e.printStackTrace();
				throw e; // Re-throw untuk memastikan aplikasi tidak start jika seeder gagal
			}
		};
	}

}
