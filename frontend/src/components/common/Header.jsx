// components/common/Header.jsx
import React from 'react';
import { Bell, User } from 'lucide-react';

const Header = ({ userRole, setUserRole, setActiveMenu }) => {
  const getUserName = () => {
    switch (userRole) {
      case 'TEACHER': return '';
      case 'PARENT': return 'Ib';
      case 'STUDENT': return 'Ahmad Rizki';
      default: return 'User';
    }
  };

  const getDashboardTitle = () => {
    switch (userRole) {
      case 'TEACHER': return 'Dashboard Guru';
      case 'PARENT': return 'Dashboard Orang Tua';
      case 'STUDENT': return 'Dashboard Siswa';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">{getDashboardTitle()}</h1>
          <p className="text-sm text-gray-500">
            Selamat datang di Student Performance Tracker
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Role Switcher for Demo */}
          <select
            value={userRole}
            onChange={(e) => {
              setUserRole(e.target.value);
              setActiveMenu('dashboard');
            }}
            className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="teacher">Guru</option>
            <option value="parent">Orang Tua</option>
            <option value="student">Siswa</option>
          </select>
          
          <button className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">2</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium">{getUserName()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;