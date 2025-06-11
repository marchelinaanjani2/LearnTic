// components/common/Sidebar.jsx
import React from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Bell, 
  Home
} from 'lucide-react';

const Sidebar = ({ userRole, activeMenu, setActiveMenu }) => {
  const getMenuItems = () => {
    switch (userRole) {
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'students', label: 'Manajemen Siswa', icon: Users },
          { id: 'input-scores', label: 'Input Nilai', icon: BookOpen },
          { id: 'performance', label: 'Performance', icon: TrendingUp },
          { id: 'notifications', label: 'Notifikasi', icon: Bell }
        ];
      case 'parent':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'performance', label: 'Nilai Anak', icon: TrendingUp },
          { id: 'notifications', label: 'Notifikasi', icon: Bell }
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'performance', label: 'Nilai Saya', icon: TrendingUp },
          { id: 'notifications', label: 'Notifikasi', icon: Bell }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-400">Learntic</h2>
        <p className="text-sm text-gray-400 mt-1">Performance Tracker</p>
      </div>
      
      <nav className="mt-6">
        {getMenuItems().map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-800 transition-colors ${
                activeMenu === item.id ? 'bg-gray-800 border-r-2 border-red-400' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;