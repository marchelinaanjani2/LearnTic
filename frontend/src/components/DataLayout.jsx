import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';

const DataLayout = () => {
    return (
      <div>
        <Navbar />
        {/* Tambahkan padding-top di sini agar tidak tertutup Navbar */}
        <div className="pt-12">
          <div className="container mx-auto px-10 py-10">
            <Outlet />
          </div>
        </div>
      </div>
    );
  };
  

export default DataLayout;
