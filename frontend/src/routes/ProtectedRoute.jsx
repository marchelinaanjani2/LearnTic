import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// Component untuk melindungi routes yang membutuhkan autentikasi
const ProtectedRoute = ({ requiredRole, requiredRoles = [] }) => {
  const { isAuthenticated, hasRole, loading, user } = useAuth();

  // Tampilkan loading spinner jika masih memuat
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect ke login jika belum authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // Jika butuh role spesifik, cek apakah user memiliki role tersebut
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" />;
  }

  // Jika ada array requiredRoles, cek apakah user memiliki salah satu dari role tersebut
  if (requiredRoles.length > 0) {
    const hasAnyRole = requiredRoles.some(role => user.role === role);
    if (!hasAnyRole) {
      return <Navigate to="/unauthorized" />;
    }
  }

  // Jika authenticated dan memiliki role yang dibutuhkan, tampilkan route
  return <Outlet />;
};

export default ProtectedRoute;