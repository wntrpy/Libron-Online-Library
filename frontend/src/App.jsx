import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import './index.css'
import './App.css'

// TEMPORARY fallback components:
// Redirect to login by default
const Home = () => {
  React.useEffect(() => {
    window.location.href = '/login';
  }, []);
  return null;
};

// Member pages
import MemberDashboard from "./pages/member/MemberDashboard";
import SavedBooks from "./pages/member/SavedBooks";
import Borrows from "./pages/member/Borrows";
import AboutUs from "./pages/member/AboutUs";
import MyAccount from "./pages/member/MyAccount";

// Librarian pages
import LibrarianDashboard from "./pages/librarian/LibrarianDashboard";
import LibrarianBooks from "./pages/librarian/Books";
import LibrarianRequests from "./pages/librarian/Requests";
import LibrarianReturns from "./pages/librarian/Returns";
import LibrarianReports from "./pages/librarian/Reports";
import LibrarianBorrowed from "./pages/librarian/Borrowed";


//Admin pages
import AdminDashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Member routes */}
        <Route path="/member/dashboard" element={<MemberDashboard />} />
        <Route path="/member/saved-books" element={<SavedBooks />} />
        <Route path="/member/borrows" element={<Borrows />} />
        <Route path="/member/about-us" element={<AboutUs />} />
        <Route path="/member/my-account" element={<MyAccount />} />

        {/* Librarian routes */}
        <Route
          path="/librarian/dashboard"
          element={<LibrarianDashboard />}
        />
        <Route path="/librarian/books" element={<LibrarianBooks />} />
        <Route path="/librarian/requests" element={<LibrarianRequests />} />
        <Route path="/librarian/returns" element={<LibrarianReturns />} />
        <Route path="/librarian/reports" element={<LibrarianReports />} />
        <Route path="/librarian/borrowed" element={<LibrarianBorrowed />} />



        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
