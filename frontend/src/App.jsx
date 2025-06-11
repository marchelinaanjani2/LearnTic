// App.jsx - Main Application Component
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/dashboard/DashboardPage';
import 'datatables.net-bs5/css/dataTables.bootstrap5.css';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        {/* Tambahkan route lainnya di sini */}
      </Routes>
    </Router>
  );
}

export default App;