# DOKUMENTASI LearnTic

## Machine Learning
### Pembuatan dummy data
Pembuatan dummy dataset dilakukan karena tim kami tidak dapat menemukan
dataset publik yang dapat diolah untuk mendukun tujuan projek kami. Pembuatan dummy dataset dibantu dengan library Pandas, dan Numpy. Dataset yang telah kami produksi sebisa mungkin dapat mencerminkan bagaimana distribusi penilaian atau aspek performa siswa SMA terjadi di dunia nyata.

Berikut variabel dataset, dan penjelasannya:
- Nilai mata pelajaran saat ini
| Kolom                                       | Tipe Data | Penjelasan                           |
| ------------------------------------------- | --------- | ------------------------------------ |
| Pendidikan Agama                            | `int64`   | Nilai pelajaran Pendidikan Agama     |
| Pendidikan Pancasila                        | `int64`   | Nilai pelajaran Pendidikan Pancasila |
| Bahasa Inggris                              | `int64`   | Nilai pelajaran Bahasa Inggris       |
| Bahasa Mandarin                             | `int64`   | Nilai pelajaran Bahasa Mandarin      |
| Matematika (Umum)                           | `int64`   | Nilai pelajaran Matematika Umum      |
| Biologi                                     | `int64`   | Nilai pelajaran Biologi              |
| Fisika                                      | `int64`   | Nilai pelajaran Fisika               |
| Kimia                                       | `int64`   | Nilai pelajaran Kimia                |
| Geografi                                    | `int64`   | Nilai pelajaran Geografi             |
| Sejarah                                     | `int64`   | Nilai pelajaran Sejarah              |
| Sosiologi                                   | `int64`   | Nilai pelajaran Sosiologi            |
| Ekonomi                                     | `int64`   | Nilai pelajaran Ekonomi              |
| Pendidikan Jasmani, Olahraga, dan Kesehatan | `int64`   | Nilai pelajaran PJOK                 |
| Informatika                                 | `int64`   | Nilai pelajaran Informatika          |
| Seni Musik                                  | `int64`   | Nilai pelajaran Seni Musik           |
| Bahasa Indonesia                            | `int64`   | Nilai pelajaran Bahasa Indonesia     |
| **Rata-rata**                               | `float64` | Rata-rata semua nilai mata pelajaran |

- Nilai mata pelajaran semester berikutnya
| Kolom                                                  | Tipe Data | Penjelasan                                  |
| ------------------------------------------------------ | --------- | ------------------------------------------- |
| Pendidikan Agama (Next Sem)                            | `int64`   | Nilai Pendidikan Agama semester berikutnya  |
| Pendidikan Pancasila (Next Sem)                        | `int64`   | Nilai Pendidikan Pancasila semester berikut |
| Bahasa Inggris (Next Sem)                              | `int64`   | Nilai Bahasa Inggris semester berikut       |
| Bahasa Mandarin (Next Sem)                             | `int64`   | Nilai Bahasa Mandarin semester berikut      |
| Matematika (Umum) (Next Sem)                           | `int64`   | Nilai Matematika Umum semester berikut      |
| Biologi (Next Sem)                                     | `int64`   | Nilai Biologi semester berikut              |
| Fisika (Next Sem)                                      | `int64`   | Nilai Fisika semester berikut               |
| Kimia (Next Sem)                                       | `int64`   | Nilai Kimia semester berikut                |
| Geografi (Next Sem)                                    | `int64`   | Nilai Geografi semester berikut             |
| Sejarah (Next Sem)                                     | `int64`   | Nilai Sejarah semester berikut              |
| Sosiologi (Next Sem)                                   | `int64`   | Nilai Sosiologi semester berikut            |
| Ekonomi (Next Sem)                                     | `int64`   | Nilai Ekonomi semester berikut              |
| Pendidikan Jasmani, Olahraga, dan Kesehatan (Next Sem) | `int64`   | Nilai PJOK semester berikut                 |
| Informatika (Next Sem)                                 | `int64`   | Nilai Informatika semester berikut          |
| Seni Musik (Next Sem)                                  | `int64`   | Nilai Seni Musik semester berikut           |
| Bahasa Indonesia (Next Sem)                            | `int64`   | Nilai Bahasa Indonesia semester berikut     |
| **Rata-rata (Next Sem)**                               | `float64` | Rata-rata semua nilai semester berikut      |
- Kategori performa
| Kolom                        | Tipe Data | Penjelasan                                                |
| ---------------------------- | --------- | --------------------------------------------------------- |
| Kategori Performa            | `object`  | Kategori performa akademik saat ini (mis. Low, Mid, High) |
| Kategori Performa (Next Sem) | `object`  | Kategori performa semester berikutnya                     |
- Data Tambahan
| Kolom                 | Tipe Data | Penjelasan                                       |
| --------------------- | --------- | ------------------------------------------------ |
| Jumlah Ketidakhadiran | `int64`   | Total hari siswa tidak hadir                     |
| Persentase Tugas      | `int64`   | Presentase penyelesaian tugas                    |
| performance\_trend    | `object`  | Pola tren performa (mis. Stable, Increase, etc.) |


 
### Exploring the Dataset
- Visualisasi Distribusi Data
- Visualisasi Korelasi data dengan 
- Pengecekan data yang hilang
- Pengecekan duplikasi data
- Pengecekan outlier

### Dataset Cleaning
-  Replace Outliers
- Drop kolom yang tidak relevan/tidak penting/tidak terdapat indikasi hubungan yang kuat dengan target fitur
### Pre-processing Cleaned Data
### Modelling & Training
### Inference
### Deployment model
## Full-Stack Web Development
