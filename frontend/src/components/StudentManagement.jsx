import api from '../api/Axios';
import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, X } from 'lucide-react';
import StudentDetailModal from './StudentDetail';
import AddStudent from './AddStudent';
import { useAuth } from '../auth/AuthContext';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('api/student-performance/viewall');
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const getStudentPrediction = (studentId) => {
    return predictions.find(p => p.siswaId === studentId) || null;
  };


  const filteredStudents = students
    .filter(student =>
      (student.namaSiswa || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(student => student.statusPrediksi !== null);

  const handleDeletePerformance = async (siswaId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data performa ini?')) {
      try {
        await api.delete(`api/student-performance/delete/${siswaId}`);
        await fetchData();
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
      const detailData = response.data.data;
      setSelectedStudent(detailData);
    } catch (error) {
      console.error('Error fetching student detail:', error);
      alert('Gagal mengambil detail siswa');
    }
  };

  const handleEdit = async (studentId) => {
    try {
      const response = await api.get(`api/student-performance/detail/${studentId}`);
      setEditForm(response.data.data);
    } catch (error) {
      console.error('Error fetching student data for edit:', error);
      alert('Gagal mengambil data siswa untuk edit');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`api/student-performance/${editForm.siswaId}/update`, editForm);
      alert("Berhasil update data!");
      setEditForm(null);
      await fetchData();
    } catch (error) {
      console.error("Error updating:", error);
      alert("Gagal update data");
    }
  };


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e, category, subject) => {
    const { value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subject]: parseInt(value)
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading student data...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Siswa</h1>
        {user?.role !== 'STUDENT' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Tambah Siswa
          </button>
        )}


      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari siswa..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                  <th className="text-left py-3">Semester</th>
                  <th className="text-left py-3">Ketidakadiran</th>
                  <th className="text-left py-3">Prediksi</th>
                  <th className="text-left py-3">Aksi</th>
                </tr>
              </thead>


              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.siswaId} className="border-b hover:bg-gray-50">
                    <td className="py-3">{student.siswaId}</td>

                    <td className="py-3">{student.semester}</td>
                    <td className="py-3">{student.jumlahKetidakhadiran}</td>
                    <td className="py-3">{student.statusPrediksi}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleViewDetail(student.siswaId)} className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>

                        {user?.role !== 'STUDENT' && (
                          <>
                            <button onClick={() => handleEdit(student.siswaId)} className="text-green-600 hover:text-green-800">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeletePerformance(student.siswaId)} className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* Edit Modal */}
      {editForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] relative overflow-y-auto max-h-[90vh]">
            <button className="absolute top-2 right-2" onClick={() => setEditForm(null)}><X /></button>
            <h2 className="text-xl font-semibold mb-4">Edit Nilai Siswa</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Semester:</label>
                <input
                  name="semester"
                  value={editForm?.semester ?? ''}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                  placeholder="Semester"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Jumlah Ketidakhadiran:</label>
                <input
                  name="jumlahKetidakhadiran"
                  value={editForm?.jumlahKetidakhadiran ?? ''}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                  placeholder="Jumlah Ketidakhadiran"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Persentase Tugas:</label>
                <input
                  name="persentaseTugas"
                  value={editForm?.persentaseTugas ?? ''}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                  placeholder="Persentase Tugas"
                />
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Nilai Ujian:</h3>
                {Object.keys(editForm.nilaiUjianPerMapel).map((subject) => (
                  <div key={subject} className="flex gap-2 mb-2">
                    <label className="w-64">{subject}</label>
                    <input
                      type="number"
                      value={editForm.nilaiUjianPerMapel[subject]}
                      onChange={(e) => handleNestedChange(e, 'nilaiUjianPerMapel', subject)}
                      className="border p-2 rounded w-24"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Nilai Tugas:</h3>
                {Object.keys(editForm.nilaiTugasPerMapel).map((subject) => (
                  <div key={subject} className="flex gap-2 mb-2">
                    <label className="w-64">{subject}</label>
                    <input
                      type="number"
                      value={editForm.nilaiTugasPerMapel[subject]}
                      onChange={(e) => handleNestedChange(e, 'nilaiTugasPerMapel', subject)}
                      className="border p-2 rounded w-24"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Nilai Kuis:</h3>
                {Object.keys(editForm.nilaiKuisPerMapel).map((subject) => (
                  <div key={subject} className="flex gap-2 mb-2">
                    <label className="w-64">{subject}</label>
                    <input
                      type="number"
                      value={editForm.nilaiKuisPerMapel[subject]}
                      onChange={(e) => handleNestedChange(e, 'nilaiKuisPerMapel', subject)}
                      className="border p-2 rounded w-24"
                    />
                  </div>
                ))}
              </div>

              <button type="submit" className="bg-green-600 text-white p-2 rounded mt-4">Simpan Perubahan</button>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddStudent onClose={() => setShowAddModal(false)} onSuccess={fetchData} />
      )}
    </div>
  );
};

export default StudentManagement;
