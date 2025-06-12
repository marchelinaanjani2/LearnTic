import api from '../api/Axios';
import { useState, useEffect } from 'react';
import { Plus, Upload, X } from 'lucide-react';

const AddStudent = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    roleName: 'STUDENT',
    kelas: ''
  });

  const [file, setFile] = useState(null);
  const [uploadMode, setUploadMode] = useState('single'); // 'single' or 'csv'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitSingle = async (e) => {
    e.preventDefault();
    try {
      await api.post('api/user/add', formData);
      alert('Siswa berhasil ditambahkan');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Gagal menambahkan siswa');
    }
  };

  const handleSubmitCSV = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Mohon pilih file CSV.");
      return;
    }
    const formDataCSV = new FormData();
    formDataCSV.append('file', file);
    try {
      await api.post('api/user/upload-csv', formDataCSV, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('CSV berhasil diupload');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert('Gagal upload CSV');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] relative">
        <button className="absolute top-2 right-2" onClick={onClose}><X /></button>
        <h2 className="text-xl font-semibold mb-4">Tambah Siswa</h2>

        <div className="mb-4 flex gap-4">
          <button onClick={() => setUploadMode('single')} className={`px-3 py-2 rounded ${uploadMode === 'single' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            Input Manual
          </button>
          <button onClick={() => setUploadMode('csv')} className={`px-3 py-2 rounded ${uploadMode === 'csv' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            Upload CSV
          </button>
        </div>

        {uploadMode === 'single' ? (
          <form onSubmit={handleSubmitSingle} className="flex flex-col gap-3">
            <input name="name" placeholder="Nama" value={formData.name} onChange={handleChange} className="border p-2 rounded" />
            <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="border p-2 rounded" />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-2 rounded" />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="border p-2 rounded" />
            <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} className="border p-2 rounded" />
            <input name="kelas" placeholder="Kelas" value={formData.kelas} onChange={handleChange} className="border p-2 rounded" />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded">Tambah Siswa</button>
          </form>
        ) : (
          <form onSubmit={handleSubmitCSV} className="flex flex-col gap-3">
            <input type="file" accept=".csv" onChange={handleFileChange} className="border p-2 rounded" />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded flex items-center justify-center gap-2"><Upload className="w-4 h-4" /> Upload CSV</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddStudent;
