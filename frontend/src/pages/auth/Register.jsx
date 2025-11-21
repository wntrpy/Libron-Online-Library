// frontend/src/pages/auth/Register.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import registrationImage from "../../assets/libron_login.png";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentNumber: "",
    college: "",
    phoneNumber: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.studentNumber.trim())
      newErrors.studentNumber = "Student number is required";
    if (!formData.college.trim()) newErrors.college = "College/Department is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm password";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          first_name: formData.firstName,
          last_name: formData.lastName,
          student_number: parseInt(formData.studentNumber),
          college: formData.college,
          phone: formData.phoneNumber,
          address: formData.address,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        // Set errors from backend
        setErrors(errorData);
        return;
      }

      alert("Registration successful! Please login with your credentials.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Main Registration Section */}
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
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            marginTop: "100px"
          }}
        >
          <div style={{ maxWidth: "100%", textAlign: "center" }}>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "800",
                marginBottom: "20px",
                lineHeight: "1.1",
              }}
            >
              Join <span style={{ color: "#fdd835" }}>Libron Library</span>
            </h1>
            <p
              style={{
                fontSize: "18px",
                color: "#b0bec5",
                marginBottom: "40px",
                lineHeight: "1.6",
              }}
            >
              Create your account as a member to start borrowing books and explore our comprehensive online catalog
            </p>

            {/* Hero Image */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
              <img
                src={registrationImage}
                alt="Join Libron"
                style={{
                  maxHeight: "500px",
                  objectFit: "contain",
                  width: "100%",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form Card */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "40px 35px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ marginBottom: "28px" }}>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#1a2332",
                  marginBottom: "6px",
                  textAlign: "center",
                }}
              >
                Create Account
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#757575",
                  textAlign: "center",
                }}
              >
                Register as a member to get started
              </p>
            </div>

            {/* Form Container */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* First Name and Last Name Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {/* First Name */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#424242",
                      marginBottom: "6px",
                    }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: `1px solid ${errors.firstName ? "#f44336" : "#e0e0e0"}`,
                      fontSize: "13px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                      backgroundColor: "#f9f9f9",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = errors.firstName ? "#f44336" : "#fdd835";
                      e.target.style.boxShadow = `0 0 0 3px rgba(253, 216, 53, ${
                        errors.firstName ? "0" : "0.1"
                      })`;
                      e.target.style.backgroundColor = "white";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.firstName ? "#f44336" : "#e0e0e0";
                      e.target.style.boxShadow = "none";
                      e.target.style.backgroundColor = "#f9f9f9";
                    }}
                  />
                  {errors.firstName && (
                    <p style={{ fontSize: "11px", color: "#f44336", margin: "4px 0 0 0" }}>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#424242",
                      marginBottom: "6px",
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: `1px solid ${errors.lastName ? "#f44336" : "#e0e0e0"}`,
                      fontSize: "13px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                      backgroundColor: "#f9f9f9",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = errors.lastName ? "#f44336" : "#fdd835";
                      e.target.style.boxShadow = `0 0 0 3px rgba(253, 216, 53, ${
                        errors.lastName ? "0" : "0.1"
                      })`;
                      e.target.style.backgroundColor = "white";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.lastName ? "#f44336" : "#e0e0e0";
                      e.target.style.boxShadow = "none";
                      e.target.style.backgroundColor = "#f9f9f9";
                    }}
                  />
                  {errors.lastName && (
                    <p style={{ fontSize: "11px", color: "#f44336", margin: "4px 0 0 0" }}>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#424242",
                    marginBottom: "6px",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: `1px solid ${errors.email ? "#f44336" : "#e0e0e0"}`,
                    fontSize: "13px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                    backgroundColor: "#f9f9f9",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.email ? "#f44336" : "#fdd835";
                    e.target.style.boxShadow = `0 0 0 3px rgba(253, 216, 53, ${
                      errors.email ? "0" : "0.1"
                    })`;
                    e.target.style.backgroundColor = "white";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? "#f44336" : "#e0e0e0";
                    e.target.style.boxShadow = "none";
                    e.target.style.backgroundColor = "#f9f9f9";
                  }}
                />
                {errors.email && (
                  <p style={{ fontSize: "11px", color: "#f44336", margin: "4px 0 0 0" }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Student Number and Phone Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {/* Student Number */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#424242",
                      marginBottom: "6px",
                    }}
                  >
                    Student Number
                  </label>
                  <input
                    type="text"
                    name="studentNumber"
                    placeholder="202401234"
                    value={formData.studentNumber}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: `1px solid ${errors.studentNumber ? "#f44336" : "#e0e0e0"}`,
                      fontSize: "13px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                      backgroundColor: "#f9f9f9",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = errors.studentNumber ? "#f44336" : "#fdd835";
                      e.target.style.boxShadow = `0 0 0 3px rgba(253, 216, 53, ${
                        errors.studentNumber ? "0" : "0.1"
                      })`;
                      e.target.style.backgroundColor = "white";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.studentNumber ? "#f44336" : "#e0e0e0";
                      e.target.style.boxShadow = "none";
                      e.target.style.backgroundColor = "#f9f9f9";
                    }}
                  />
                  {errors.studentNumber && (
                    <p style={{ fontSize: "11px", color: "#f44336", margin: "4px 0 0 0" }}>
                      {errors.studentNumber}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#424242",
                      marginBottom: "6px",
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="+1234567890"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: `1px solid ${errors.phoneNumber ? "#f44336" : "#e0e0e0"}`,
                      fontSize: "13px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                      backgroundColor: "#f9f9f9",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = errors.phoneNumber ? "#f44336" : "#fdd835";
                      e.target.style.boxShadow = `0 0 0 3px rgba(253, 216, 53, ${
                        errors.phoneNumber ? "0" : "0.1"
                      })`;
                      e.target.style.backgroundColor = "white";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.phoneNumber ? "#f44336" : "#e0e0e0";
                      e.target.style.boxShadow = "none";
                      e.target.style.backgroundColor = "#f9f9f9";
                    }}
                  />
                  {errors.phoneNumber && (
                    <p style={{ fontSize: "11px", color: "#f44336", margin: "4px 0 0 0" }}>
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* College/Department */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#424242",
                    marginBottom: "6px",
                  }}
                >
                  College/Department
                </label>
                <input
                  type="text"
                  name="college"
                  placeholder="Engineering / Science"
                  value={formData.college}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: `1px solid ${errors.college ? "#f44336" : "#e0e0e0"}`,
                    fontSize: "13px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                    backgroundColor: "#f9f9f9",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.college ? "#f44336" : "#fdd835";
                    e.target.style.boxShadow = `0 0 0 3px rgba(253, 216, 53, ${
                      errors.college ? "0" : "0.1"
                    })`;
                    e.target.style.backgroundColor = "white";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.college ? "#f44336" : "#e0e0e0";
                    e.target.style.boxShadow = "none";
                    e.target.style.backgroundColor = "#f9f9f9";
                  }}
                />
                {errors.college && (
                  <p style={{ fontSize: "11px", color: "#f44336", margin: "4px 0 0 0" }}>
                    {errors.college}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#424242",
                    marginBottom: "6px",
                  }}
                >
                  Address
                </label>
                <textarea
                  name="address"
                  placeholder="123 Main St, City, State"
                  value={formData.address}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: `1px solid ${errors.address ? "#f44336" : "#e0e0e0"}`,
                    fontSize: "13px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                    backgroundColor: "#f9f9f9",
                    minHeight: "60px",
                    resize: "vertical",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.address ? "#f44336" : "#fdd835";
                    e.target.style.boxShadow = `0 0 0 3px rgba(253, 216, 53, ${
                      errors.address ? "0" : "0.1"
                    })`;
                    e.target.style.backgroundColor = "white";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.address ? "#f44336" : "#e0e0e0";
                    e.target.style.boxShadow = "none";
                    e.target.style.backgroundColor = "#f9f9f9";
                  }}
                />
                {errors.address && (
                  <p style={{ fontSize: "11px", color: "#f44336", margin: "4px 0 0 0" }}>
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Password and Confirm Password Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {/* Password */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#424242",
                      marginBottom: "6px",
                    }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: `1px solid ${errors.password ? "#f44336" : "#e0e0e0"}`,
                      fontSize: "13px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                      backgroundColor: "#f9f9f9",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = errors.password ? "#f44336" : "#fdd835";
                      e.target.style.boxShadow = `0 0 0 3px rgba(253, 216, 53, ${
                        errors.password ? "0" : "0.1"
                      })`;
                      e.target.style.backgroundColor = "white";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.password ? "#f44336" : "#e0e0e0";
                      e.target.style.boxShadow = "none";
                      e.target.style.backgroundColor = "#f9f9f9";
                    }}
                  />
                  {errors.password && (
                    <p style={{ fontSize: "11px", color: "#f44336", margin: "4px 0 0 0" }}>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#424242",
                      marginBottom: "6px",
                    }}
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: `1px solid ${errors.confirmPassword ? "#f44336" : "#e0e0e0"}`,
                      fontSize: "13px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                      backgroundColor: "#f9f9f9",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = errors.confirmPassword
                        ? "#f44336"
                        : "#fdd835";
                      e.target.style.boxShadow = `0 0 0 3px rgba(253, 216, 53, ${
                        errors.confirmPassword ? "0" : "0.1"
                      })`;
                      e.target.style.backgroundColor = "white";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.confirmPassword
                        ? "#f44336"
                        : "#e0e0e0";
                      e.target.style.boxShadow = "none";
                      e.target.style.backgroundColor = "#f9f9f9";
                    }}
                  />
                  {errors.confirmPassword && (
                    <p style={{ fontSize: "11px", color: "#f44336", margin: "4px 0 0 0" }}>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: isLoading ? "#e0e0e0" : "#fdd835",
                color: isLoading ? "#757575" : "#1a2332",
                fontSize: "15px",
                fontWeight: "700",
                border: "none",
                borderRadius: "8px",
                cursor: isLoading ? "not-allowed" : "pointer",
                marginTop: "20px",
                transition: "background-color 0.3s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "#f9c802";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "#fdd835";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              {isLoading ? "Registering..." : "Create Account"}
            </button>

            {/* Login Link */}
            <div style={{ textAlign: "center", fontSize: "13px", color: "#757575", marginTop: "16px" }}>
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
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
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
