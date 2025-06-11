package com.example.codingCamp.student.service;

import com.example.codingCamp.profile.model.Student;
import com.example.codingCamp.profile.repository.StudentRepository;
import com.example.codingCamp.student.dto.request.CreateStudentPerformanceRequestDTO;
import com.example.codingCamp.student.dto.request.UpdateStudentPerformanceRequestDTO;
import com.example.codingCamp.student.dto.response.StudentPerformanceResponseDTO;
import com.example.codingCamp.student.model.StudentPerformance;
import com.example.codingCamp.student.repository.StudentPerformanceRepository;
import com.opencsv.CSVReader;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.resource.NoResourceFoundException;
import java.util.Optional;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import org.springframework.data.domain.Sort;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class StudentPerformanceServiceImpl implements StudentPerformanceService {

    @Autowired
    private StudentPerformanceRepository studentPerformanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    // kalo pilih inputnya per siswa
    @Override
    public StudentPerformanceResponseDTO createPerformance(CreateStudentPerformanceRequestDTO request) {
        Student siswa = studentRepository.findById(request.getSiswaId())
                .orElseThrow(() -> new RuntimeException("Siswa tidak ditemukan"));

        Integer avgUjian = avg(request.getNilaiUjianPerMapel());
        Integer avgTugas = avg(request.getNilaiTugasPerMapel());
        Integer avgKuis = avg(request.getNilaiKuisPerMapel());

        Integer nilaiAkhir = (int) ((avgUjian * 0.4) + (avgTugas * 0.3) + (avgKuis * 0.3));

        StudentPerformance data = new StudentPerformance();
        data.setStudent(siswa);
        data.setNilaiUjianPerMapel(request.getNilaiUjianPerMapel());
        data.setNilaiTugasPerMapel(request.getNilaiTugasPerMapel());
        data.setNilaiKuisPerMapel(request.getNilaiKuisPerMapel());
        data.setJumlahKetidakhadiran(request.getJumlahKetidakhadiran());
        data.setPersentaseTugas(request.getPersentaseTugas());
        data.setSemester(request.getSemester());
        data.setNilaiAkhirRataRata(nilaiAkhir);
        data.setSubmittedForPrediction(false);
        data.setCreatedAt(new Date());
        data.setUpdatedAt(new Date());
        data.setDeletedAt(request.getDeletedAt());

        StudentPerformance saved = studentPerformanceRepository.save(data);

        return toStudentPerformanceResponse(saved);
    }

    // kalo mau input by csv
    @Override
    public List<StudentPerformanceResponseDTO> createBulkPerformance(
            List<CreateStudentPerformanceRequestDTO> requestList) {
        List<StudentPerformance> toSave = requestList.stream()
                .map(req -> {
                    Student siswa = studentRepository.findById(req.getSiswaId())
                            .orElseThrow(() -> new RuntimeException(
                                    "Siswa dengan ID " + req.getSiswaId() + " tidak ditemukan"));

                    Integer avgUjian = avg(req.getNilaiUjianPerMapel());
                    Integer avgTugas = avg(req.getNilaiTugasPerMapel());
                    Integer avgKuis = avg(req.getNilaiKuisPerMapel());
                    Integer nilaiAkhir = (int) ((avgUjian * 0.4) + (avgTugas * 0.3) + (avgKuis * 0.3));

                    StudentPerformance data = new StudentPerformance();
                    data.setStudent(siswa);
                    data.setNilaiUjianPerMapel(req.getNilaiUjianPerMapel());
                    data.setNilaiTugasPerMapel(req.getNilaiTugasPerMapel());
                    data.setNilaiKuisPerMapel(req.getNilaiKuisPerMapel());
                    data.setJumlahKetidakhadiran(req.getJumlahKetidakhadiran());
                    data.setPersentaseTugas(req.getPersentaseTugas());
                    data.setSemester(req.getSemester());
                    data.setNilaiAkhirRataRata(nilaiAkhir);
                    data.setSubmittedForPrediction(false);
                    data.setCreatedAt(new Date());
                    data.setUpdatedAt(new Date());
                    data.setDeletedAt(req.getDeletedAt());
                    return data;
                })
                .collect(Collectors.toList());

        List<StudentPerformance> savedList = studentPerformanceRepository.saveAll(toSave);
        return savedList.stream().map(this::toStudentPerformanceResponse).collect(Collectors.toList());
    }

    @Override
    public List<StudentPerformanceResponseDTO> importFromCSV(MultipartFile file) {
        List<CreateStudentPerformanceRequestDTO> requestList = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            // Gunakan OpenCSV untuk parsing yang lebih reliable
            CSVReader csvReader = new CSVReader(reader);

            // Skip header
            String[] header = csvReader.readNext();
            System.out.println("CSV Header: " + Arrays.toString(header));

            String[] values;
            int rowNumber = 1;

            while ((values = csvReader.readNext()) != null) {
                rowNumber++;

                // Debug: Print setiap baris
                System.out.println("Row " + rowNumber + ": " + Arrays.toString(values));

                if (values.length < 62) { // Sesuaikan dengan jumlah kolom yang diharapkan (62 kolom)
                    throw new RuntimeException(
                            "Format CSV tidak sesuai pada baris " + rowNumber +
                                    ". Dibutuhkan 62 kolom, ditemukan: " + values.length);
                }

                CreateStudentPerformanceRequestDTO request = new CreateStudentPerformanceRequestDTO();

                try {
                    // Parse student ID (kolom 1)
                    Long studentId = Long.parseLong(values[0].trim());
                    request.setSiswaId(studentId);

                    // Debug: Print student ID yang sedang diproses
                    System.out.println("Processing Student ID: " + studentId);

                    // Daftar mata pelajaran sesuai urutan baru
                    String[] mapel = {
                            "Pendidikan Agama", "Pendidikan Pancasila", "Bahasa Inggris", "Bahasa Mandarin",
                            "Matematika (Umum)", "Biologi", "Fisika", "Kimia", "Geografi", "Sejarah",
                            "Sosiologi", "Ekonomi", "Kimia Lanjutan", "Fisika Lanjutan", "Biologi Lanjutan",
                            "Pendidikan Jasmani, Olahraga, dan Kesehatan", "Informatika", "Seni Musik",
                            "Bahasa Indonesia"
                    };

                    Map<String, Integer> nilaiUjian = new LinkedHashMap<>();
                    Map<String, Integer> nilaiTugas = new LinkedHashMap<>();
                    Map<String, Integer> nilaiKuis = new LinkedHashMap<>();

                    // Parse nilai ujian (kolom 2-20, index 1-19)

                    for (int i = 0; i < mapel.length; i++) {
                        nilaiUjian.put(mapel[i], Integer.parseInt(values[i + 1].trim()));
                    }

                    // Parse nilai tugas (kolom 21-39, index 20-38)
                    for (int i = 0; i < mapel.length; i++) {
                        nilaiTugas.put(mapel[i], Integer.parseInt(values[i + 20].trim()));
                    }

                    // Parse nilai kuis (kolom 40-58, index 39-57)
                    for (int i = 0; i < mapel.length; i++) {
                        nilaiKuis.put(mapel[i], Integer.parseInt(values[i + 39].trim()));
                    }

                    request.setNilaiUjianPerMapel(nilaiUjian);
                    request.setNilaiTugasPerMapel(nilaiTugas);
                    request.setNilaiKuisPerMapel(nilaiKuis);

                    // Parse data lainnya
                    // Kolom 59 (index 58) - jumlahKetidakhadiran
                    request.setJumlahKetidakhadiran(Integer.parseInt(values[58].trim()));

                    // Kolom 60 (index 59) - persentaseTugas
                    request.setPersentaseTugas(Integer.parseInt(values[59].trim()));

                    // Kolom 61 (index 60) - semester
                    request.setSemester(values[60].trim());

                    // Parse tanggal - Kolom 62 (index 61) - createdAt
                    if (values.length > 61 && !values[61].trim().isEmpty()) {
                        String dateStr = values[61].trim();
                        Date createdAt = parseDate(dateStr);
                        request.setCreatedAt(createdAt);
                    }

                    requestList.add(request);

                } catch (NumberFormatException e) {
                    throw new RuntimeException("Error parsing data pada baris " + rowNumber +
                            ": " + Arrays.toString(values) + ". Error: " + e.getMessage());
                }
            }

            csvReader.close();

            System.out.println("Total records parsed: " + requestList.size());

            return createBulkPerformance(requestList);

        } catch (Exception e) {
            throw new RuntimeException("Gagal memproses file CSV: " + e.getMessage(), e);
        }
    }

    // Helper method untuk parsing CSV line dengan handling quotes
    // Ganti method parseCSVLine() dengan yang lebih robust
    private String[] parseCSVLine(String line) {
        List<String> result = new ArrayList<>();
        boolean inQuotes = false;
        StringBuilder currentField = new StringBuilder();

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (c == '"') {
                // Handle escaped quotes
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    currentField.append('"');
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                result.add(currentField.toString().trim());
                currentField = new StringBuilder();
            } else {
                currentField.append(c);
            }
        }

        // Add the last field
        result.add(currentField.toString().trim());

        // Debug: Print parsed values untuk troubleshooting
        System.out.println("Parsed CSV line: " + result);

        return result.toArray(new String[0]);
    }

    // Helper method untuk parsing tanggal
    private Date parseDate(String dateStr) {
        try {
            // Coba format M/d/yyyy (seperti 6/1/2024)
            SimpleDateFormat sdf1 = new SimpleDateFormat("M/d/yyyy");
            return sdf1.parse(dateStr);
        } catch (Exception e1) {
            try {
                // Coba format yyyy-MM-dd
                SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
                return sdf2.parse(dateStr);
            } catch (Exception e2) {
                throw new RuntimeException(
                        "Format tanggal tidak valid: " + dateStr + ". Gunakan format M/d/yyyy atau yyyy-MM-dd");
            }
        }
    }

    @Override
    public StudentPerformanceResponseDTO updatePerformance(Long id, UpdateStudentPerformanceRequestDTO request) {
        StudentPerformance performance = studentPerformanceRepository.findById(id)
                .orElseThrow(
                        () -> new NoResourceFoundException("StudentPerformance dengan ID " + id + " tidak ditemukan"));

        Student student = studentRepository.findById(request.getSiswaId())
                .orElseThrow(() -> new NoResourceFoundException(
                        "Siswa dengan ID " + request.getSiswaId() + " tidak ditemukan"));

        Integer avgUjian = avg(request.getNilaiUjianPerMapel());
        Integer avgTugas = avg(request.getNilaiTugasPerMapel());
        Integer avgKuis = avg(request.getNilaiKuisPerMapel());

        Integer nilaiAkhir = (int) ((avgUjian * 0.4) + (avgTugas * 0.3) + (avgKuis * 0.3));

        performance.setStudent(student);
        performance.setNilaiUjianPerMapel(request.getNilaiUjianPerMapel());
        performance.setNilaiTugasPerMapel(request.getNilaiTugasPerMapel());
        performance.setNilaiKuisPerMapel(request.getNilaiKuisPerMapel());
        performance.setJumlahKetidakhadiran(request.getJumlahKetidakhadiran());
        performance.setPersentaseTugas(request.getPersentaseTugas());
        performance.setSemester(request.getSemester());
        performance.setNilaiAkhirRataRata(nilaiAkhir);
        performance.setUpdatedAt(new Date());
        performance.setDeletedAt(request.getDeletedAt());

        studentPerformanceRepository.save(performance);

        return toStudentPerformanceResponse(performance);
    }

    @Override
    public List<StudentPerformanceResponseDTO> getAllPerformance(String sortBy) {
        String sortField = (sortBy != null && !sortBy.isEmpty()) ? sortBy : "updatedAt";
        Sort sort = Sort.by(Sort.Direction.DESC, sortField);

        List<StudentPerformance> performanceList = studentPerformanceRepository.findAll(sort);

        return performanceList.stream()
                .map(this::toStudentPerformanceResponse)
                .collect(Collectors.toList());
    }

    @Override
    public StudentPerformanceResponseDTO getPerformanceByStudentId(Long studentId) {
        StudentPerformance performance = studentPerformanceRepository.findByStudent_Id(studentId)
                .orElseThrow(() -> new NoResourceFoundException(
                        "Performance untuk siswa dengan ID " + studentId + " tidak ditemukan"));

        return toStudentPerformanceResponse(performance);
    }

    private Integer avg(Map<String, Integer> mapel) {
        if (mapel == null || mapel.isEmpty())
            return 0;

        return (int) Math.round(mapel.values().stream()
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0));
    }

    private StudentPerformanceResponseDTO toStudentPerformanceResponse(StudentPerformance performance) {
        return new StudentPerformanceResponseDTO(
                performance.getId(),
                performance.getStudent().getId(),
                performance.getStudent().getName(),
                performance.getNilaiUjianPerMapel(),
                performance.getNilaiTugasPerMapel(),
                performance.getNilaiKuisPerMapel(),
                performance.getNilaiAkhirRataRata(),
                performance.getJumlahKetidakhadiran(),
                performance.getPersentaseTugas(),
                performance.getSemester(),
                performance.getStatusPrediksi(),
                performance.getCreatedAt(),
                performance.getDeletedAt(),
                performance.getUpdatedAt());
    }

    @Override
    public void deletePerformance(Long id) {
        StudentPerformance performance = studentPerformanceRepository.findById(id)
                .orElseThrow(
                        () -> new NoResourceFoundException("StudentPerformance dengan ID " + id + " tidak ditemukan"));

        studentPerformanceRepository.delete(performance);
    }

    // Add this method to your StudentPerformanceServiceImpl class
    @Override
    public void validateCSVFormat(MultipartFile file) {
        String fileName = file.getOriginalFilename();

        // Validate file extension
        if (fileName == null || !fileName.toLowerCase().endsWith(".csv")) {
            throw new RuntimeException("File harus berformat CSV (.csv)");
        }

        // Validate file size (max 10MB)
        long maxSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxSize) {
            throw new RuntimeException("Ukuran file terlalu besar. Maksimal 10MB");
        }

        try (
                BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
                CSVReader csvReader = new CSVReader(reader)) {
            // Read and validate header
            String[] header = csvReader.readNext();
            if (header == null) {
                throw new RuntimeException("File CSV kosong atau tidak memiliki header");
            }

            // Check expected number of columns (e.g., 53)
            if (header.length < 53) {
                throw new RuntimeException(
                        "Format CSV tidak sesuai. Dibutuhkan minimal 53 kolom, ditemukan: " + header.length);
            }

        } catch (IOException e) {
            throw new RuntimeException("Gagal membaca file CSV: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Gagal memvalidasi format CSV: " + e.getMessage(), e);
        }
    }

}
