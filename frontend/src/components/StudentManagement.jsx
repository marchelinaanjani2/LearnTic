import api from '../api/Axios'; 
import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all students
        const studentsResponse = await api.get('api/student');
        const studentsData = Array.isArray(studentsResponse.data.data) ? studentsResponse.data.data : [];
        setStudents(studentsData);

        // Fetch predictions
        const predictionResponse = await api.get('api/prediction/batch');
        const predictionsData = Array.isArray(predictionResponse.data.data) ? predictionResponse.data.data : [];
        setPredictions(predictionsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setStudents([]);
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentPrediction = (studentId) => {
    return predictions.find(p => p.siswaId === studentId) || {};
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading student data...</div>
      </div>
    );
  }

  const handleDeletePerformance = async (performanceId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data performa ini?')) {
      try {
        await api.delete(`api/student-performance/delete/${performanceId}`);
        // Refresh data after delete
        setPredictions(predictions.filter(p => p.predictionId !== performanceId));
        alert('Data performa berhasil dihapus');
      } catch (error) {
        console.error('Error deleting performance:', error);
        alert('Gagal menghapus data performa');
      }
    }
  };

  const handleViewDetail = async (studentId) => {
    try {
      const response = await api.get(`api/student-performance/detail/${studentId}`);
      const detailData = response.data;
      setSelectedStudent(detailData);
      console.log('Student detail:', detailData);
    } catch (error) {
      console.error('Error fetching student detail:', error);
      alert('Gagal mengambil detail siswa');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Siswa</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Tambah Siswa
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Cari siswa..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Tidak ada siswa yang sesuai dengan pencarian' : 'Tidak ada data siswa tersedia'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">ID</th>
                  <th className="text-left py-3">Nama Siswa</th>
                  <th className="text-left py-3">Semester</th>
                  <th className="text-left py-3">Ketidakadiran</th>
                  <th className="text-left py-3">Prediksi</th>
                  <th className="text-left py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const prediction = getStudentPrediction(student.id);
                  return (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{student.id}</td>
                      <td className="py-3">{student.name || student.nama || `Siswa ${student.id}`}</td>
                      <td className="py-3">{prediction.semesterSiswa || 'N/A'}</td>
                      <td className="py-3">{prediction.jumlahKetidakhadiran || 0}</td>
                      <td className="py-3">{prediction.statusPrediksi || 'Belum ada prediksi'}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleViewDetail(student.id)}
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-800"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800"
                            onClick={() => prediction.predictionId && handleDeletePerformance(prediction.predictionId)}
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
