import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";// Install terlebih dahulu: npm install jwt-decode
import config from '../config'; // Import konfigurasi API dari file config.js

// Buat context untuk autentikasi
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inisialisasi state user dari localStorage saat pertama kali load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Cek apakah token masih valid (belum expired)
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            username: decoded.sub,
            id: decoded.id,
            role: decoded.role
          });
        } else {
          // Token expired, hapus dari localStorage
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Fungsi login
  const login = async (emailOrUsername, password) => {
    try {
      // Contoh request ke API untuk login
      const response = await fetch(`${config.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      if (!response.ok) {
        throw new Error('Login gagal');
      }

      const data = await response.json();
      const token = data.data.token;

      // Simpan token di localStorage
      localStorage.setItem('token', token);

      // Decode token untuk mendapatkan informasi user
      const decoded = jwtDecode(token);
      setUser({
        username: decoded.sub,
        id: decoded.id,
        role: decoded.role
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Fungsi logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);

  };

  // Fungsi untuk mengecek apakah user sudah login
  const isAuthenticated = () => {
    return !!user;
  };

  // Fungsi untuk mengecek apakah user memiliki role tertentu
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Fungsi untuk mendapatkan token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Nilai yang akan dishare melalui context
  const authContextValue = {
    user,
    login,
    logout,
    isAuthenticated,
    hasRole,
    getToken,
    loading
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk menggunakan auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};