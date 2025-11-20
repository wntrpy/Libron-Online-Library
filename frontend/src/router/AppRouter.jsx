// frontend/src/AppRouter.jsx (or wherever your router is)
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '../pages/auth/Login';

import MemberDashboard from '../pages/member/Dashboard';
import SavedBooks from '../pages/member/SavedBooks';
import Borrows from '../pages/member/Borrows';
import AboutUs from '../pages/member/AboutUs';
import MyAccount from '../pages/member/MyAccount';

import LibrarianDashboard from '../pages/librarian/Dashboard';
import AdminDashboard from '../pages/admin/Dashboard';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Member Routes */}
        <Route path="/member/dashboard" element={<MemberDashboard />} />
        <Route path="/member/saved-books" element={<SavedBooks />} />
        <Route path="/member/borrows" element={<Borrows />} />
        <Route path="/member/about-us" element={<AboutUs />} />
        <Route path="/member/my-account" element={<MyAccount />} />

        {/* Other dashboards */}
        <Route path="/librarian/dashboard" element={<LibrarianDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
