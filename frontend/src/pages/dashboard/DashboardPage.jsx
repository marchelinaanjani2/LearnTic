import { Bell, User } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import TeacherDashboard from '../../components/dashboard/TeacherDashboard';
import PerformanceDashboard from '../../components/dashboard/PerformanceDashboard';
import StudentManagement from '../../components/StudentManagement';
import ScoreInputForm from '../../components/forms/ScoreInputForm';
import NotificationsPanel from '../../components/notification/NotificationCard';
import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLocation, Navigate } from 'react-router-dom';


const DashboardPage = () => {
  const { user } = useAuth();
  const location = useLocation(); 

  if (!user) return <div>Loading...</div>;

  const activeMenu = location.pathname.split('/')[1] || 'dashboard';
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return user?.role === 'TEACHER' ?
          <TeacherDashboard /> :
          <PerformanceDashboard userRole={user?.role} />;

      case 'students':
        return user?.role === 'TEACHER' || user?.role === "STUDENT" ?
          <StudentManagement /> :
          <Navigate to="/students" />;

      case 'input-scores':
        return user?.role === 'TEACHER' ?
          <ScoreInputForm /> :
          <Navigate to="/input-scores" />;

      case 'performance':
        return <PerformanceDashboard userRole={user?.role} />;

      case 'notifications':
        return <NotificationsPanel userRole={user?.role} />;

      default:
        return <Navigate to="/dashboard" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        userRole={user?.role}
        activeMenu={activeMenu}
      />

      <div className="flex-1">
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-semibold">
                {user?.role === 'TEACHER' ? 'Dashboard Guru' :
                  user?.role === 'PARENT' ? 'Dashboard Orang Tua' : 'Dashboard Siswa'}
              </h1>
              <p className="text-sm text-gray-500">
                Selamat datang di Student Performance Tracker
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">2</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium">{user?.username}</span>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};


export default DashboardPage;
