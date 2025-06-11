import { useState } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff, Save, Loader2, Shield } from 'lucide-react';
import api from '../api/Axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleBack = () => {
    window.location.href = '/profile';
  };

  const validateForm = () => {
    const errors = {};

    // Validate old password
    if (!formData.oldPassword.trim()) {
      errors.oldPassword = 'Password lama tidak boleh kosong';
    }

    // Validate new password
    if (!formData.newPassword.trim()) {
      errors.newPassword = 'Password baru tidak boleh kosong';
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'Password baru minimal 6 karakter';
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Konfirmasi password tidak boleh kosong';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password tidak sama dengan password baru';
    }

    // Check if new password is same as old password
    if (formData.oldPassword && formData.newPassword && formData.oldPassword === formData.newPassword) {
      errors.newPassword = 'Password baru harus berbeda dengan password lama';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
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

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Mohon perbaiki kesalahan pada form');
      return;
    }

    try {
      setSaving(true);
      const requestBody = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      };

      const response = await api.post('/api/profile/update-password', requestBody);
      
      if (response.data.status === 200) {
        toast.success(response.data.message || 'Password berhasil diperbarui');
        // Reset form
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1500);
      } else {
        toast.error(response.data.message || 'Gagal memperbarui password');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Terjadi kesalahan saat memperbarui password');
      }
    } finally {
      setSaving(false);
    }
  };

  const renderPasswordField = (field, label, placeholder, icon) => {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          {icon}
          {label}
        </label>
        <div className="relative">
          <input 
            type={showPassword[field] ? 'text' : 'password'}
            value={formData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={`w-full px-3 py-2 pr-10 bg-white border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors[field] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility(field)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword[field] ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        </div>
        {validationErrors[field] && (
          <p className="text-red-500 text-xs mt-1">{validationErrors[field]}</p>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="p-5">
        <div className="table-container bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Ubah Password</h2>
              <p className="text-gray-600 text-sm mt-1">Perbarui password untuk keamanan akun Anda</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Security Header */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-100">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 rounded-full p-4 flex justify-center items-center">
                  <Shield size={40} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Keamanan Akun</h3>
                  <p className="text-gray-600">Pastikan password baru Anda kuat dan mudah diingat</p>
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Lock size={12} className="mr-1" />
                      Password Protected
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Form */}
            <div className="max-w-2xl mx-auto space-y-6">
              {renderPasswordField(
                'oldPassword',
                'Password Lama',
                'Masukkan password lama Anda',
                <Lock size={16} className="mr-2 text-gray-500" />
              )}

              {renderPasswordField(
                'newPassword',
                'Password Baru',
                'Masukkan password baru (minimal 6 karakter)',
                <Lock size={16} className="mr-2 text-green-500" />
              )}

              {renderPasswordField(
                'confirmPassword',
                'Konfirmasi Password Baru',
                'Ulangi password baru Anda',
                <Lock size={16} className="mr-2 text-blue-500" />
              )}
            </div>

            {/* Password Requirements */}
            <div className="max-w-2xl mx-auto bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Persyaratan Password:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  Minimal 6 karakter
                </li>
                <li className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  Password baru dan konfirmasi harus sama
                </li>
                <li className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    formData.oldPassword && formData.newPassword && formData.oldPassword !== formData.newPassword ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  Password baru harus berbeda dengan password lama
                </li>
              </ul>
            </div>

            {/* Security Tips */}
            <div className="max-w-2xl mx-auto bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Tips Keamanan:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol</li>
                <li>• Jangan gunakan informasi pribadi yang mudah ditebak</li>
                <li>• Jangan gunakan password yang sama dengan akun lain</li>
                <li>• Simpan password di tempat yang aman</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200 max-w-2xl mx-auto">
              <button
                onClick={handleBack}
                className="flex items-center px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                disabled={saving}
              >
                <ArrowLeft size={16} className="mr-2" />
                Batal
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