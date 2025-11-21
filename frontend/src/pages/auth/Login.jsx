// frontend/src/pages/auth/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../../assets/libron_login.png";
import browseCatalogIcon from "../../assets/browse_the_catalog_icon.png";
import saveOrBorrowIcon from "../../assets/save_or_borrow_icon.png";
import pickUpIcon from "../../assets/pick_up_a_book_icon.png";

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
    <div style={{ backgroundColor: "#f5f5f5" }}>
      {/* Hero Section with Login Form */}
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#1a2332",
          backgroundImage: "linear-gradient(135deg, #111827 0%, 100%)",
        }}
      >
        {/* Left Side - Hero Section with Image */}
        <div
          style={{
            flex: 1,
            color: "white",
            padding: "60px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ maxWidth: "90%" }}>
            <h1
              style={{
                fontSize: "64px",
                fontWeight: "800",
                marginBottom: "20px",
                lineHeight: "1.1",
                maxWidth: "700px",
              }}
            >
              Search and Borrow at{" "}
              <span style={{ color: "#fdd835" }}>Libron Library.</span>
            </h1>
            <p
              style={{
                fontSize: "24px",
                color: "#b0bec5",
                marginBottom: "40px",
                lineHeight: "1.2",
                maxWidth: "550px",
              }}
            >
              Access our comprehensive online catalog, borrow physical books, and collect them conveniently
            </p>
          </div>

          {/* Hero Image */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <img
              src={loginImage}
              alt="Student reading"
              style={{
                maxHeight: "430px",
                objectFit: "contain",
                width: "100%",
              }}
            />
          </div>
        </div>

        {/* Right Side - Login Form Card */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "50px 40px",
              width: "100%",
              maxWidth: "440px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#1a2332",
                  marginBottom: "8px",
                  textAlign: "center",
                }}
              >
                Welcome
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#757575",
                  textAlign: "center",
                }}
              >
                Login to your account
              </p>
            </div>

            {/* Email Input */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#424242",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid #e0e0e0",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  backgroundColor: "#f9f9f9",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#fdd835";
                  e.target.style.boxShadow = "0 0 0 3px rgba(253, 216, 53, 0.1)";
                  e.target.style.backgroundColor = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                  e.target.style.boxShadow = "none";
                  e.target.style.backgroundColor = "#f9f9f9";
                }}
              />
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#424242",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid #e0e0e0",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  backgroundColor: "#f9f9f9",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#fdd835";
                  e.target.style.boxShadow = "0 0 0 3px rgba(253, 216, 53, 0.1)";
                  e.target.style.backgroundColor = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                  e.target.style.boxShadow = "none";
                  e.target.style.backgroundColor = "#f9f9f9";
                }}
              />
            </div>

            {/* Forgot Password Link */}
            <div style={{ textAlign: "right", marginBottom: "24px" }}>
              <button
                onClick={() => navigate("/forgot-password")}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#757575",
                  fontSize: "12px",
                  cursor: "pointer",
                  padding: "0",
                  fontWeight: "500",
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              style={{
                width: "100%",
                padding: "14px 16px",
                backgroundColor: "#fdd835",
                color: "#1a2332",
                fontSize: "16px",
                fontWeight: "700",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                marginBottom: "16px",
                transition: "background-color 0.3s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f9c802";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#fdd835";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Log in
            </button>

            {/* Sign Up Link */}
            <div style={{ textAlign: "center", fontSize: "13px", color: "#757575" }}>
              No account?{" "}
              <button
                onClick={() => navigate("/register")}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#fdd835",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                  padding: "0",
                }}
              >
                Create here
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ backgroundColor: "white", padding: "60px 40px", borderTop: "4px solid #fdd835" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1a2332",
              marginBottom: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "32px",
                backgroundColor: "#fdd835",
                borderRadius: "3px",
              }}
            />
            How Libron Online Library works?
          </h2>

          {/* Features Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "30px",
              marginBottom: "60px",
            }}
          >
            {/* Feature 1 */}
            <div
              style={{
                backgroundColor: "#f9f9f9",
                border: "2px solid #e0e0e0",
                borderRadius: "15px",
                padding: "30px",
                textAlign: "center",
                transition: "box-shadow 0.3s, transform 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <img
                  src={browseCatalogIcon}
                  alt="Browse"
                  style={{
                    height: "50px",
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1a2332",
                  marginBottom: "12px",
                }}
              >
                Browse the Catalog
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#757575",
                  lineHeight: "1.6",
                }}
              >
                Find books by title, author, or genre. Check real-time availability for the E-Library location.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              style={{
                backgroundColor: "#f9f9f9",
                border: "2px solid #e0e0e0",
                borderRadius: "15px",
                padding: "30px",
                textAlign: "center",
                transition: "box-shadow 0.3s, transform 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <img
                  src={saveOrBorrowIcon}
                  alt="Save or Borrow"
                  style={{
                    height: "50px",
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1a2332",
                  marginBottom: "12px",
                }}
              >
                Save or Borrow
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#757575",
                  lineHeight: "1.6",
                }}
              >
                Save unavailable titles to your reading list. Reserve available books immediately for pickup.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              style={{
                backgroundColor: "#f9f9f9",
                border: "2px solid #e0e0e0",
                borderRadius: "15px",
                padding: "30px",
                textAlign: "center",
                transition: "box-shadow 0.3s, transform 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <img
                  src={pickUpIcon}
                  alt="Pick-up"
                  style={{
                    height: "50px",
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1a2332",
                  marginBottom: "12px",
                }}
              >
                Pick-up a Book
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#757575",
                  lineHeight: "1.6",
                }}
              >
                Visit the E-Library to collect your borrowed titles.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div
            style={{
              backgroundColor: "#f9f9f9",
              border: "2px solid #e0e0e0",
              borderRadius: "15px",
              padding: "50px 40px",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1a2332",
                marginBottom: "15px",
              }}
            >
              Ready to Start your Reading?
            </h3>
            <p
              style={{
                fontSize: "15px",
                color: "#757575",
                marginBottom: "30px",
                lineHeight: "1.6",
              }}
            >
              Sign up now to connect to the Libron platform and start borrowing physical books from the E-Library.
            </p>
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "14px 40px",
                backgroundColor: "#fdd835",
                color: "#1a2332",
                fontSize: "16px",
                fontWeight: "700",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "background-color 0.3s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f9c802";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#fdd835";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#1a2332",
          color: "white",
          padding: "40px 40px",
          textAlign: "center",
          borderTop: "1px solid #333",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          ONLINE
          <br />
          <span style={{ color: "#fdd835" }}>Libron Library.</span>
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "#b0bec5",
            marginBottom: "16px",
          }}
        >
          E-Catalog • About Us
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "#757575",
          }}
        >
          © 2025 Libron. All rights reserved.
        </p>
      </div>
    </div>
  );
}
