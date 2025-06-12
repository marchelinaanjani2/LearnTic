import { useState, useEffect } from 'react';
import { ArrowLeft, User, Calendar, Mail, Phone, Tag, UserCheck, Loader2, Save } from 'lucide-react';
import api from '../api/Axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditProfilePage() {
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    username: '',
    email: '',
    phone: ''
  });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleBack = () => {
    window.location.href = '/profile';
  };

  const validateForm = () => {
    const errors = {};

    // Validate name
    if (!userData.name.trim()) {
      errors.name = 'Nama tidak boleh kosong';
    }

    // Validate username
    if (!userData.username.trim()) {
      errors.username = 'Username tidak boleh kosong';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email.trim()) {
      errors.email = 'Email tidak boleh kosong';
    } else if (!emailRegex.test(userData.email)) {
      errors.email = 'Format email tidak valid';
    }

    // Validate phone
    const phoneRegex = /^\d+$/;
    if (!userData.phone.trim()) {
      errors.phone = 'Nomor telepon tidak boleh kosong';
    } else if (!phoneRegex.test(userData.phone)) {
      errors.phone = 'Nomor telepon harus berisi angka saja';
    } else if (userData.phone.length < 10 || userData.phone.length > 15) {
      errors.phone = 'Nomor telepon harus 10-15 digit';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Mohon perbaiki kesalahan pada form');
      return;
    }

    try {
      setSaving(true);
      const requestBody = {
        id: userData.id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        phone: userData.phone
      };

      const response = await api.post('/api/profile/update', requestBody);
      
      if (response.data.status === 200) {
        toast.success(response.data.message || 'Profile berhasil diperbarui');
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1500);
      } else {
        toast.error(response.data.message || 'Gagal memperbarui profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Terjadi kesalahan saat memperbarui profile');
      }
    } finally {
      setSaving(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/profile');
      
      if (response.data.status === 200) {
        const data = response.data.data;
        const profileData = {
          id: data.id,
          name: data.name,
          username: data.username,
          email: data.email,
          phone: data.phone
        };
        setUserData(profileData);
        setOriginalData(data);
        setError(null);
      } else {
        setError('Gagal mengambil data profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Terjadi kesalahan saat mengambil data profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-5">
        <div className="table-container bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <p className="text-gray-600">Memuat data profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <div className="table-container bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center space-y-4">
              <div className="bg-red-100 rounded-full p-4 inline-block">
                <User size={32} className="text-red-500" />
              </div>
              <div>
                <p className="text-red-600 font-medium">{error}</p>
                <button 
                  onClick={fetchProfile}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-5">
        <div className="table-container bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
              <p className="text-gray-600 text-sm mt-1">Perbarui informasi akun Anda</p>
            </div>
          </div>
      
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-full p-4 flex justify-center items-center">
                  <User size={40} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{originalData?.name}</h3>
                  <p className="text-gray-600">@{originalData?.username}</p>
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <UserCheck size={12} className="mr-1" />
                      {originalData?.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="mr-2 text-gray-500" />
                    Nama Lengkap
                  </label>
                  <input 
                    type="text" 
                    value={userData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan nama lengkap"
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Tag size={16} className="mr-2 text-gray-500" />
                    Username
                  </label>
                  <input 
                    type="text" 
                    value={userData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan username"
                  />
                  {validationErrors.username && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.username}</p>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <UserCheck size={16} className="mr-2 text-gray-500" />
                    Role
                  </label>
                  <input 
                    type="text" 
                    value={originalData?.role || ''} 
                    readOnly 
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-gray-500 text-xs mt-1">Role tidak dapat diubah</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="mr-2 text-gray-500" />
                    Email
                  </label>
                  <input 
                    type="email" 
                    value={userData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan alamat email"
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="mr-2 text-gray-500" />
                    No. Telepon
                  </label>
                  <input 
                    type="text" 
                    value={userData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan nomor telepon (10-15 digit)"
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Hanya angka, 10-15 digit</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    Bergabung Sejak
                  </label>
                  <input 
                    type="text" 
                    value={originalData ? formatDate(originalData.createdAt) : ''} 
                    readOnly 
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Last Updated Info */}
            {originalData && (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center">
                  <Calendar size={16} className="text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-700">
                    Terakhir diperbarui: {formatDate(originalData.updatedAt)}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handleBack}
                className="flex items-center px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                disabled={saving}
              >
                <ArrowLeft size={16} className="mr-2" />
                Kembali
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ backgroundColor: '#162556' }}
                className="flex items-center px-6 py-2 text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Simpan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}