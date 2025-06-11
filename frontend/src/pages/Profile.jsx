import { useState, useEffect } from 'react';
import { MoreVertical, Lock, Edit, User, Calendar, Mail, Phone, Tag, UserCheck, Loader2 } from 'lucide-react';
import { EyeIcon, PencilIcon, XMarkIcon, PlusIcon } from '@heroicons/react/20/solid';
import api from '../api/Axios';

export default function ProfilePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEditProfile = () => {
    window.location.href = '/profile/edit';
    setIsMenuOpen(false);
  };

  const handleChangePassword = () => {
    window.location.href = '/profile/change-password';
    setIsMenuOpen(false);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/profile');

      if (response.data.status === 200) {
        setUserData(response.data.data);
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
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Profil
          </h2>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4 items-center">

          <span className="sm:ml-5">
            <button
              type="button" onClick={handleChangePassword}
              className="inline-flex items-center rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-yellow-950 shadow-xs hover:bg-yellow-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

            >
              <Lock aria-hidden="true" className="mr-1.5 -ml-0.5 size-5" />
              Ubah Password
            </button>
          </span>
          <span className="sm:ml-5">
            <button
              type="button" onClick={handleEditProfile}
              className="inline-flex items-center rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-yellow-950 shadow-xs hover:bg-yellow-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

            >
              <PencilIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5" />
              Ubah Profil
            </button>
          </span>
        </div>

      </div>
      <div className="mt-5">
        <div className="table-container bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              

              
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
                  <h3 className="text-xl font-semibold text-gray-800">{userData.name}</h3>
                  <p className="text-gray-600">@{userData.username}</p>
                  <div className="flex items-center mt-2">
                    <span className={`status-label ${userData.role.toLowerCase()}`}>
                      {userData.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information Grid */}
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
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Tag size={16} className="mr-2 text-gray-500" />
                    Username
                  </label>
                  <input
                    type="text"
                    value={userData.username}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <UserCheck size={16} className="mr-2 text-gray-500" />
                    Role
                  </label>
                  <input
                    type="text"
                    value={userData.role}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="mr-2 text-gray-500" />
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    value={userData.phone}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    Bergabung Sejak
                  </label>
                  <input
                    type="text"
                    value={formatDate(userData.createdAt)}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Last Updated Info */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center">
                <Calendar size={16} className="text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-700">
                  Terakhir diperbarui: {formatDate(userData.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}