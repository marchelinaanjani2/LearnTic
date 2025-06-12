package com.example.codingCamp.security;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.codingCamp.dto.BaseResponseDTO;
import com.example.codingCamp.security.entrypoint.AuthEntryPoint;
import com.example.codingCamp.security.jwt.JwtTokenFilter;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtTokenFilter jwtTokenFilter;

    @Autowired
    private AuthEntryPoint authEntryPoint;

    @Bean
    public SecurityFilterChain jwtFilterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults())
                .securityMatcher("/api/**")
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(requests -> requests

                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/notification").hasAnyAuthority("STUDENT", "TEACHER", "PARENT")
                        .requestMatchers("/api/prediction/batch").hasAuthority( "TEACHER")
                        .requestMatchers("/api/user/add").hasAuthority( "TEACHER")
                        .requestMatchers("/api/user/upload-csv").hasAuthority( "TEACHER")
                        .requestMatchers("/api/user/update").hasAuthority( "TEACHER")
                        .requestMatchers("/api/user/delete").hasAuthority( "TEACHER")
                        .requestMatchers("/api/user/viewall").hasAuthority( "TEACHER")
                        .requestMatchers("/api/student-performance/create").hasAuthority( "TEACHER")
                        .requestMatchers("/api/student-performance/{id}/update").hasAuthority( "TEACHER")
                        .requestMatchers("/api/student-performance/viewall").hasAnyAuthority( "TEACHER", "STUDENT", "PARENT")
                        .requestMatchers("/api/student-performance/detail/{id}").hasAnyAuthority( "TEACHER", "STUDENT", "PARENT")
                        .requestMatchers("/api/student-performance/delete/{id}").hasAuthority( "TEACHER")
                        .requestMatchers("/api/student-performance/upload-csv").hasAuthority( "TEACHER")

                        .requestMatchers("/api/user").hasAnyAuthority("STUDENT", "TEACHER", "PARENT")

                        .requestMatchers("/api/student").hasAnyAuthority( "TEACHER", "STUDENT")
                        .requestMatchers("/api/prediction/viewall").hasAnyAuthority("STUDENT", "TEACHER", "PARENT")
                        .requestMatchers("/api/profile").hasAnyAuthority("STUDENT", "TEACHER", "PARENT")
                        .requestMatchers("/api/profile/update").hasAnyAuthority("STUDENT", "TEACHER", "PARENT")
                        .requestMatchers("/api/profile/update-password").hasAnyAuthority("STUDENT", "TEACHER", "PARENT")






                        
                        .anyRequest().authenticated())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(
                                authEntryPoint)
                        .accessDeniedHandler(
                                new AccessDeniedHandler() {
                                    @Override
                                    public void handle(HttpServletRequest request, HttpServletResponse response,
                                            AccessDeniedException accessDeniedException)
                                            throws IOException, ServletException {

                                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                                        response.setContentType("application/json");

                                        BaseResponseDTO<Object> responseDTO = new BaseResponseDTO<>();
                                        responseDTO.setStatus(HttpServletResponse.SC_FORBIDDEN);
                                        responseDTO.setMessage("Anda Tidak Memiliki Akses ke Endpoint Ini!");
                                        responseDTO.setTimestamp(new Date());

                                        ObjectMapper mapper = new ObjectMapper();
                                        String jsonResponse = mapper.writeValueAsString(responseDTO);

                                        response.getWriter().write(jsonResponse);
                                    }
                                }));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(encoder());
    }
}
