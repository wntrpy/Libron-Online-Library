import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/auth/Login";

// Simple Home component to show backend message
function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/test/")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage("Error connecting to backend"));
  }, []);

  return (
    <div>
      <h1>React + Django Book Borrow System</h1>
      <p>{message}</p>
      <nav>
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register (Members)</Link> |{" "}
        <Link to="/forgot-password">Forgot Password</Link>
      </nav>
    </div>
  );
}

// Placeholder Register page
function Register() {
  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Member Registration</h2>
      <p>This page will be implemented later.</p>
      <Link to="/login">Back to Login</Link>
    </div>
  );
}

// Placeholder Forgot Password page
function ForgotPassword() {
  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Forgot Password</h2>
      <p>This page will be implemented later.</p>
      <Link to="/login">Back to Login</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
