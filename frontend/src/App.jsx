import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import './index.css'
import './App.css'

// TEMPORARY fallback components:
const Home = () => <h1>Home Page</h1>;
const ForgotPassword = () => <h1>Forgot Password Page</h1>;

// Member pages
import MemberDashboard from "./pages/member/MemberDashboard";
import SavedBooks from "./pages/member/SavedBooks";
import Borrows from "./pages/member/Borrows";
import AboutUs from "./pages/member/AboutUs";
import MyAccount from "./pages/member/MyAccount";

// Librarian & Admin pages
import LibrarianDashboard from "./pages/librarian/Dashboard";
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

        {/* Librarian/Admin */}
        <Route
          path="/librarian/dashboard"
          element={<LibrarianDashboard />}
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
