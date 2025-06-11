import { useState, useEffect } from 'react';
import { User, ChevronRight, BarChart3, Clock, BookMarked } from 'lucide-react';
import DashboardCard from '../common/DashboardCard';
import api from '../../api/Axios';

const PerformanceDashboard = ({ userRole }) => {
  const [selectedClass, setSelectedClass] = useState('XI');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/student-performance/viewall');
        setStudents(response.data.data || []);
        setError(null);
        
      } catch (err) {
        console.error('Failed to fetch performance data:', err);
        setError('Failed to fetch performance data');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculatePerformanceStats = () => {
    if (!students.length) return { total: 0, categories: [] };

    const statusCounts = students.reduce((acc, student) => {
      const status = student.statusPrediksi || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const total = students.length;
    const categories = [
      {
        name: 'Peningkatan Signifikan',
        count: statusCounts['Significant Increase Performance'] || 0,
        color: 'bg-emerald-500',
        percentage: Math.round(((statusCounts['Significant Increase Performance'] || 0) / total) * 100)
      },
      {
        name: 'Performa Stabil',
        count: statusCounts['Stable Performance'] || 0,
        color: 'bg-blue-500',
        percentage: Math.round(((statusCounts['Stable Performance'] || 0) / total) * 100)
      },
      {
        name: 'Penurunan Signifikan',
        count: statusCounts['Significant Decrease Performance'] || 0,
        color: 'bg-red-500',
        percentage: Math.round(((statusCounts['Significant Decrease Performance'] || 0) / total) * 100)
      }
    ];
    return { total, categories };
  };

  const performanceData = calculatePerformanceStats();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {userRole === 'TEACHER'
              ? 'Dashboard Performa Siswa'
              : userRole === 'STUDENT'
              ? 'Nilai Saya'
              : 'Nilai Anak'}
          </h1>
          <p className="text-gray-600">Pantau perkembangan akademik secara real-time</p>
        </div>
        {/* {userRole === 'TEACHER' && (
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          >
            <option value="X">Kelas X</option>
            <option value="XI">Kelas XI</option>
            <option value="XII">Kelas XII</option>
          </select>
        )} */}
      </div>

      {userRole === 'TEACHER' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Ringkasan Performa Kelas</h2>
          <div className="flex items-center gap-12">
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-8 border-gray-100 relative">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {performanceData.categories.map((category, index) => {
                    const radius = 42;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDasharray = `${(category.percentage / 100) * circumference} ${circumference}`;
                    const rotation = performanceData.categories
                      .slice(0, index)
                      .reduce((acc, cat) => acc + (cat.percentage / 100) * 360, 0);

                    return (
                      <circle
                        key={index}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={category.color.replace('bg-', '#')}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset="0"
                        transform={`rotate(${rotation} 50 50)`}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">{performanceData.total}</div>
                    <div className="text-sm text-gray-500 font-medium">Total Siswa</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {performanceData.categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                    <span className="font-medium text-gray-700">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-lg font-bold text-gray-800">{category.count}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${category.color} transition-all duration-500`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-12">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer transform hover:-translate-y-1"
            
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {student.namaSiswa?.charAt(0) || 'S'}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">
                  {userRole === 'STUDENT' ? 'Profil Saya' : student.namaSiswa}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {student.kelas} • {student.semester}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Rata-rata Nilai
                </span>
                <span className="text-lg font-bold text-gray-800">{student.rataRataNilaiAkhir}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Ketidakhadiran
                </span>
                <span className="text-lg font-bold text-gray-800">{student.jumlahKetidakhadiran}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <BookMarked className="w-4 h-4" />
                  Persentase Tugas
                </span>
                <span className="text-lg font-bold text-gray-800">{student.persentaseTugas}%</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Status Prediksi</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    student.statusPrediksi === 'Significant Increase Performance' 
                      ? 'text-emerald-700 bg-emerald-100'
                      : student.statusPrediksi === 'Stable Performance' 
                      ? 'text-yellow-700 bg-yellow-100'
                      : 'text-red-700 bg-red-100'
                  }`}>
                    {student.statusPrediksi === 'Significant Increase Performance'
                      ? 'Meningkat'
                      : student.statusPrediksi === 'Significant Decrease Performance'
                      ? 'Menurun'
                      : 'Stabil'}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      student.statusPrediksi === 'Significant Increase Performance'
                        ? 'bg-emerald-500'
                        : student.statusPrediksi === 'Stable Performance'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${student.rataRataNilaiAkhir}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-4 py-2 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
