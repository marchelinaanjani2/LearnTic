import { useState } from 'react';
import { Bell, User } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import TeacherDashboard from '../../components/dashboard/TeacherDashboard';
import PerformanceDashboard from '../../components/dashboard/PerformanceDashboard';
import StudentManagement from '../../components/StudentManagement';
import ScoreInputForm from '../../components/forms/ScoreInputForm';
import NotificationsPanel from '../../components/notification/NotificationCard';

const DashboardPage = () => {
  const [userRole, setUserRole] = useState('teacher'); // 'teacher', 'parent', 'student'
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        if (userRole === 'teacher') {
          return <TeacherDashboard />;
        } else {
          return <PerformanceDashboard userRole={userRole} />;
        }
      case 'students':
        return userRole === 'teacher' ? <StudentManagement /> : <PerformanceDashboard userRole={userRole} />;
      case 'input-scores':
        return userRole === 'teacher' ? <ScoreInputForm /> : <PerformanceDashboard userRole={userRole} />;
      case 'performance':
        return <PerformanceDashboard userRole={userRole} />;
      case 'notifications':
        return <NotificationsPanel userRole={userRole} />;
      default:
        return <TeacherDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        userRole={userRole}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-semibold">
                {userRole === 'teacher' ? 'Dashboard Guru' :
                  userRole === 'parent' ? 'Dashboard Orang Tua' : 'Dashboard Siswa'}
              </h1>
              <p className="text-sm text-gray-500">
                Selamat datang di Student Performance Tracker
              </p>
            </div>

            <div className="flex items-center gap-4">
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
                <span className="text-sm font-medium">
                  {userRole === 'teacher' ? 'Pak Budi' :
                    userRole === 'parent' ? 'Ibu Sari' : 'Ahmad Rizki'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;