import React, { useState, useEffect } from 'react';
import { Users, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';
import DashboardCard from '../common/DashboardCard';
import api from '../../api/Axios';
import { Eye } from 'lucide-react';

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all students
        const studentsResponse = await api.get('api/student');
        const studentsData = Array.isArray(studentsResponse.data) ? studentsResponse.data : studentsResponse.data.data || [];
        setStudents(studentsData);

        // Fetch all users
        const usersResponse = await api.get('api/user/viewall');
        const usersData = Array.isArray(usersResponse.data) ? usersResponse.data : usersResponse.data.data || [];
        setAllUsers(usersData);

        // Fetch batch predictions for all students
        const predictionsResponse = await api.get('api/prediction/batch');
        const predictionsData = Array.isArray(predictionsResponse.data.data) ? predictionsResponse.data.data : [];
        setPredictions(predictionsData);

      } catch (err) {
        console.error('Failed to fetch students:', err);
        setStudents([]);
        setAllUsers([]);
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper functions
  const getPredictionByStudentId = (studentId) => {
    return predictions.find(p => p.siswaId === studentId);
  };

  const getStatusPrediksi = (studentId) => {
    const prediction = getPredictionByStudentId(studentId);
    return prediction ? prediction.statusPrediksi : 'Belum ada prediksi';
  };

  const getSemesterFromPrediction = (studentId) => {
    const prediction = getPredictionByStudentId(studentId);
    return prediction ? prediction.semesterSiswa : '-';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Significant Increase Performance': return 'text-green-600';
      case 'Stable Performance': return 'text-blue-600';
      case 'Significant Decrease Performance': return 'text-yellow-600';
      case 'Belum ada prediksi': return 'text-gray-400';
      default: return 'text-red-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  const studentCount = students.length;

  const countByStatus = (status) => {
    return students.filter(s => getStatusPrediksi(s.id) === status).length;
  };

  const significantIncreaseCount = countByStatus('Significant Increase Performance');
  const stableCount = countByStatus('Stable Performance');
  const significantDecreaseCount = countByStatus('Significant Decrease Performance');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Guru</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Siswa"
          value={studentCount}
          subtitle="Siswa aktif"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          icon={Users}
        />
        <DashboardCard
          title="Perlu Perhatian"
          value={significantDecreaseCount}
          subtitle="Siswa berisiko"
          color="bg-gradient-to-br from-orange-500 to-red-500"
          icon={AlertTriangle}
        />
        <DashboardCard
          title="Prestasi Baik"
          value={significantIncreaseCount}
          subtitle="Siswa berprestasi"
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          icon={CheckCircle}
        />
        <DashboardCard
          title="Stabil"
          value={stableCount}
          subtitle="Siswa stabil"
          color="bg-green-600"
          icon={CheckCircle}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ringkasan Performa Siswa</h2>
        {students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data siswa tersedia
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">ID</th>
                  <th className="text-left py-3">Nama Siswa</th>
                  <th className="text-left py-3">Kelas</th>
                  <th className="text-left py-3">Semester</th>
                  <th className="text-left py-3">Status Prediksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const status = getStatusPrediksi(student.id);
                  const semester = getSemesterFromPrediction(student.id);
                  return (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{student.id}</td>
                      <td className="py-3">{student.name || student.nama || `Siswa ${student.id}`}</td>
                      <td className="py-3">{student.kelas || student.class || 'XI'}</td>
                      <td className="py-3">{semester}</td>
                      <td className="py-3">
                        <span className={`font-medium ${getStatusColor(status)}`}>
                          {status}
                        </span>
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

export default TeacherDashboard;
