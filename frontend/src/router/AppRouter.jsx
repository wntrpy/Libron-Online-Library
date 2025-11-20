import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

import MemberDashboard from "../pages/member/Dashboard";
import LibrarianDashboard from "../pages/librarian/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/member/dashboard" element={<MemberDashboard />} />
        <Route path="/librarian/dashboard" element={<LibrarianDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}
