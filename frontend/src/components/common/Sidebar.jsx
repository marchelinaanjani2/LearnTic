import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { navigation } from '../../data/Navigation';
import { Home, BookOpen, TrendingUp, Bell, User, Users } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Tambahkan semua icon yang diperlukan
const iconMap = {
  Home,
  BookOpen,
  TrendingUp,
  Bell,
  Users, // Tambahkan icon Users untuk student management
};

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      toast.success('Berhasil Logout');
      await new Promise(resolve => setTimeout(resolve, 1000));
      logout();
      navigate('/login');
    } catch (error) {
      toast.error('Gagal logout');
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-400">Learntic</h2>
        <p className="text-sm text-gray-400 mt-1">Performance Tracker</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => {
            const IconComponent = iconMap[item.icon];
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.id}
                to={item.href}
                className={classNames(
                  isActive 
                    ? 'bg-blue-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200'
                )}
              >
                {IconComponent && (
                  <IconComponent 
                    className={classNames(
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white',
                      'mr-3 h-5 w-5'
                    )}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center justify-between">
          {/* Username */}
          {user && user.username && (
            <span className="text-sm font-medium text-white truncate">
              {user.username}
            </span>
          )}

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <div>
              <MenuButton className="flex items-center rounded-full bg-gray-700 p-2 text-gray-300 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                <span className="sr-only">Open user menu</span>
                <User className="h-5 w-5" />
              </MenuButton>
            </div>
            <MenuItems className="absolute bottom-full right-0 mb-2 w-48 origin-bottom-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <MenuItem>
                {({ focus }) => (
                  <Link
                    to="/profile"
                    className={classNames(
                      focus ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700'
                    )}
                  >
                    Profil
                  </Link>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <a
                    href="#"
                    onClick={handleLogout}
                    className={classNames(
                      focus ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700'
                    )}
                  >
                    Log out
                  </a>
                )}
              </MenuItem>
            </MenuItems>
          </Menu>
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
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default Sidebar;