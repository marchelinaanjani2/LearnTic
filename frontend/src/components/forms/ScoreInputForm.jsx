import { useState, useEffect } from 'react';
import { CheckCircle, Upload } from 'lucide-react';
import api from '../../api/Axios';

const ScoreInputForm = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [absenceCount, setAbsenceCount] = useState(0);
  const [assignmentPercentage, setAssignmentPercentage] = useState(0);
  const [semester, setSemester] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csvFile, setCsvFile] = useState(null);

  const subjects = [
    'Pendidikan Agama', 'Pendidikan Pancasila', 'Bahasa Inggris',
    'Bahasa Mandarin', 'Matematika (Umum)', 'Biologi', 'Fisika', 'Kimia',
    'Geografi', 'Sejarah', 'Sosiologi', 'Ekonomi', 'Kimia Lanjutan', 'Fisika Lanjutan',
    'Biologi Lanjutan', 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
    'Informatika', 'Seni Musik', 'Bahasa Indonesia'
  ];

  const [examScores, setExamScores] = useState({});
  const [taskScores, setTaskScores] = useState({});
  const [quizScores, setQuizScores] = useState({});

  useEffect(() => {
    const initialScores = {};
    subjects.forEach(subject => {
      initialScores[subject] = '';
    });
    setExamScores(initialScores);
    setTaskScores(initialScores);
    setQuizScores(initialScores);
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('api/student');
        const studentsData = Array.isArray(response.data) ? response.data : response.data.data || [];
        setStudents(studentsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
        setError('Gagal memuat data siswa');
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleScoreChange = (subject, type, value) => {
    const score = Math.min(100, Math.max(0, parseInt(value) || 0));
    if (type === 'exam') {
      setExamScores(prev => ({ ...prev, [subject]: score }));
    } else if (type === 'task') {
      setTaskScores(prev => ({ ...prev, [subject]: score }));
    } else if (type === 'quiz') {
      setQuizScores(prev => ({ ...prev, [subject]: score }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      // validasi form manual
      if (!selectedStudent || !absenceCount || !assignmentPercentage || !semester) {
        alert("Mohon lengkapi semua field form");
        return;
      }

      const formatScores = (scores) => {
        const formatted = {};
        subjects.forEach(subject => {
          formatted[subject] = parseInt(scores[subject]) || 0;
        });
        return formatted;
      };

      const scoreData = {
        siswaId: parseInt(selectedStudent),
        nilaiUjianPerMapel: formatScores(examScores),
        nilaiTugasPerMapel: formatScores(taskScores),
        nilaiKuisPerMapel: formatScores(quizScores),
        jumlahKetidakhadiran: parseInt(absenceCount) || 0,
        persentaseTugas: parseInt(assignmentPercentage) || 0,
        kelas: selectedClass,
        semester: selectedSemester
      };

      try {
        const response = await api.post('api/student-performance/create', scoreData);
        alert('Nilai berhasil disimpan!');
        console.log('Response:', response.data);
        resetForm();
      } catch (error) {
        console.error('Error saving scores:', error);
        alert('Gagal menyimpan nilai');
      }
    } else {
      // kirim file CSV
      await handleCsvUpload();
    }
  };

  const resetForm = () => {
    setSelectedStudent('');
    setAbsenceCount('');
    setAssignmentPercentage('');
    setSemester('');
    setSelectedClass('');
    setSelectedSemester('');
    setExamScores(generateInitialScores());
    setTaskScores(generateInitialScores());
    setQuizScores(generateInitialScores());
    setCsvFile(null);
  };
  
  const handleCsvUpload = async () => {
    if (!csvFile) {
      alert('Silakan pilih file CSV terlebih dahulu');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await api.post('api/student-performance/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Upload CSV berhasil!');
      console.log('CSV upload response:', response.data);
      setCsvFile(null);
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert('Gagal upload CSV');
    }
  };

  if (loading) {
    return <div className="p-6">Memuat data siswa...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Input Nilai Siswa</h1>

      {/* Upload CSV */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg flex items-center gap-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
        />
        <button
          type="button"
          onClick={handleCsvUpload}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" /> Upload CSV
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Student Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Pilih Siswa</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Pilih Siswa</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} {student.kelas ? `(${student.kelas})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Jumlah Ketidakhadiran</label>
            <input
              type="number"
              min="0"
              value={absenceCount}
              onChange={(e) => setAbsenceCount(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Persentase Tugas (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={assignmentPercentage}
              onChange={(e) => setAssignmentPercentage(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="ganjil">Ganjil</option>
              <option value="genap">Genap</option>
            </select>
          </div>
        </div>

        {/* Score Input Sections */}
        <div className="space-y-8">
          {/* Exam Scores */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Nilai Ujian</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <div key={`exam-${subject}`}>
                  <label className="block text-sm font-medium mb-1">{subject}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={examScores[subject] || ''}
                    onChange={(e) => handleScoreChange(subject, 'exam', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Task Scores */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600">Nilai Tugas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <div key={`task-${subject}`}>
                  <label className="block text-sm font-medium mb-1">{subject}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taskScores[subject] || ''}
                    onChange={(e) => handleScoreChange(subject, 'task', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Scores */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-600">Nilai Kuis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <div key={`quiz-${subject}`}>
                  <label className="block text-sm font-medium mb-1">{subject}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={quizScores[subject] || ''}
                    onChange={(e) => handleScoreChange(subject, 'quiz', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Simpan Nilai
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            onClick={() => {
              setSelectedStudent('');
              setAbsenceCount(0);
              setAssignmentPercentage(0);
              setSemester('ganjil');
              const emptyScores = {};
              subjects.forEach(subject => (emptyScores[subject] = ''));
              setExamScores(emptyScores);
              setTaskScores(emptyScores);
              setQuizScores(emptyScores);
            }}
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScoreInputForm;