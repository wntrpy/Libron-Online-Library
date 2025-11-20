// frontend/src/pages/auth/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
   const res = await fetch("http://127.0.0.1:8000/api/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });


      if (!res.ok) {
        alert("Invalid email or password");
        return;
      }

      const user = await res.json();

      // Save user info in localStorage (or context/global state)
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on user_type
      if (user.user_type === "member") {
        navigate("/member/dashboard");
      } else if (user.user_type === "librarian") {
        navigate("/librarian/dashboard");
      } else if (user.user_type === "admin") {
        navigate("/admin/dashboard");
      } else {
        alert("Unknown user type");
      }
    } catch {
  alert("An error occurred. Please try again.");
    }

  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 6,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 15,
          borderRadius: 4,
          border: "1px solid #ccc",
          fontSize: 16,
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 15,
          borderRadius: 4,
          border: "1px solid #ccc",
          fontSize: 16,
        }}
      />

      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: "#007bff",
          color: "white",
          fontSize: 16,
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginBottom: 10,
        }}
      >
        Login
      </button>

      <button
        onClick={() => navigate("/forgot-password")}
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: "transparent",
          border: "none",
          color: "#007bff",
          fontSize: 14,
          cursor: "pointer",
          marginBottom: 20,
          textDecoration: "underline",
        }}
      >
        Forgot Password?
      </button>

      <div style={{ textAlign: "center", fontSize: 14 }}>
        No account?{" "}
        <button
          onClick={() => navigate("/register")}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: 14,
            padding: 0,
          }}
        >
          Create one
        </button>
      </div>
    </div>
  );
}
