import React from 'react';

const StudentDetailModal = ({ student, onClose }) => {
  if (!student) return null;

  const renderMapelScores = (title, scores) => (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Mata Pelajaran</th>
            <th className="p-2 border">Nilai</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(scores).map(([mapel, nilai]) => (
            <tr key={mapel}>
              <td className="p-2 border">{mapel}</td>
              <td className="p-2 border">{nilai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-4xl max-h-[90%] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Detail Performa Siswa</h2>
        <div className="mb-4">
          <p><strong>Nama:</strong> {student.namaSiswa}</p>
          <p><strong>Semester:</strong> {student.semester}</p>
          <p><strong>Jumlah Ketidakhadiran:</strong> {student.jumlahKetidakhadiran}</p>
          <p><strong>Persentase Tugas:</strong> {student.persentaseTugas}%</p>
          <p><strong>Status Prediksi:</strong> {student.statusPrediksi}</p>
          <p><strong>Nilai Akhir Rata-rata:</strong> {student.rataRataNilaiAkhir}</p>
        </div>

        {renderMapelScores("Nilai Ujian Per Mapel", student.nilaiUjianPerMapel)}
        {renderMapelScores("Nilai Tugas Per Mapel", student.nilaiTugasPerMapel)}
        {renderMapelScores("Nilai Kuis Per Mapel", student.nilaiKuisPerMapel)}

        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Tutup</button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
