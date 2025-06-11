// src/pages/Unauthorized.jsx
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-3xl font-bold mb-2">401 - Unauthorized</h1>
      <p className="text-gray-600 mb-6">
        Anda tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
