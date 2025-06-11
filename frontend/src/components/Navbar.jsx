import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navigation } from '../data/Navigation';
import { useAuth } from '../auth/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Handle logout click dengan async/await untuk memastikan toast muncul
  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      // Tampilkan toast terlebih dahulu
      toast.success('Berhasil Logout');

      // Tunggu sebentar agar toast sempat muncul
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Lakukan logout
      logout();
      navigate('/login');
    } catch (error) {
      toast.error('Gagal logout');
    }
  };

  return (
    <div className="min-h-full">
      <nav className="bg-blue-950 fixed top-0 w-full z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <img
                  alt="Your Company"
                  src="/logo/logo-white.svg"
                  className="h-[25px] w-auto"
                />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation
                    .filter((item) => item.roles.includes(user?.role))
                    .map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          location.pathname === item.href ? 'bg-blue-900 text-white' : 'text-slate-400 hover:bg-blue-900 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {/* Notification Icon with Link */}
                <Link
                  to="/notification"
                  className="relative rounded-full bg-blue-900 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 focus:outline-hidden"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </Link>

                {/* Username tampil di samping icon user */}
                {user && user.username && (
                  <span className="ml-4 text-sm font-medium text-white">
                    {user.username}
                  </span>
                )}

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-200 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 p-2 border border-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <User className="size-5 text-gray-800" />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5"
                  >
                    <MenuItem key="profile">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profil
                      </Link>
                    </MenuItem>
                    <MenuItem key="logout">
                      <a
                        href="#"
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Log out
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ToastContainer dengan z-index yang lebih tinggi */}
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
}