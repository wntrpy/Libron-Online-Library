import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LibronLoginImg from "../../assets/libron_login.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";


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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    <div style={{ backgroundColor: "#f5f5f5", height: "100vh", overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          height: "100vh",
          backgroundColor: "#1a2332",
          backgroundImage: "linear-gradient(135deg, #111827 0%, 100%)",
        }}
      >
        {/* Left Side - Hero Section */}
        <div
          style={{
            flex: 1,
            color: "white",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: "100%", textAlign: "center" }}>
            <h1
              style={{
                fontSize: "42px",
                fontWeight: "800",
                marginBottom: "16px",
                lineHeight: "1.1",
              }}
            >
              Join <span style={{ color: "#fdd835" }}>Libron Library</span>
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "#b0bec5",
                marginBottom: "30px",
                lineHeight: "1.5",
              }}
            >
              Create your account as a member to start borrowing books and explore our comprehensive online catalog
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                height: "91%",
                paddingBottom: "20px",
              }}
            >
              <img
                src={LibronLoginImg}
                alt="Libron Login"
                style={{
                  width: "80%",
                  objectFit: "contain",
                }}
              />
            </div>


          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "24px 28px",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#1a2332",
                  marginBottom: "4px",
                  textAlign: "center",
                }}
              >
                Create Account
              </h2>
              <p
                style={{
                  fontSize: "12px",
                  color: "#757575",
                  textAlign: "center",
                }}
              >
                Register as a member to get started
              </p>
            </div>

            {/* Form Container */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* First Name and Last Name Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#424242",
                      marginBottom: "4px",
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
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: `1px solid ${errors.firstName ? "#f44336" : "#e0e0e0"}`,
                      fontSize: "12px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      backgroundColor: "#f9f9f9",
                    }}
                  />
                  {errors.firstName && (
                    <p style={{ fontSize: "10px", color: "#f44336", margin: "3px 0 0 0" }}>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#424242",
                      marginBottom: "4px",
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
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: `1px solid ${errors.lastName ? "#f44336" : "#e0e0e0"}`,
                      fontSize: "12px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      backgroundColor: "#f9f9f9",
                    }}
                  />
                  {errors.lastName && (
                    <p style={{ fontSize: "10px", color: "#f44336", margin: "3px 0 0 0" }}>
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
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#424242",
                    marginBottom: "4px",
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
                    padding: "8px 10px",
                    borderRadius: "6px",
                    border: `1px solid ${errors.email ? "#f44336" : "#e0e0e0"}`,
                    fontSize: "12px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    backgroundColor: "#f9f9f9",
                  }}
                />
                {errors.email && (
                  <p style={{ fontSize: "10px", color: "#f44336", margin: "3px 0 0 0" }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Student Number and Phone Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#424242",
                      marginBottom: "4px",
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
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: `1px solid ${errors.studentNumber ? "#f44336" : "#e0e0e0"}`,
                      fontSize: "12px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      backgroundColor: "#f9f9f9",
                    }}
                  />
                  {errors.studentNumber && (
                    <p style={{ fontSize: "10px", color: "#f44336", margin: "3px 0 0 0" }}>
                      {errors.studentNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#424242",
                      marginBottom: "4px",
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
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: `1px solid ${errors.phoneNumber ? "#f44336" : "#e0e0e0"}`,
                      fontSize: "12px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      backgroundColor: "#f9f9f9",
                    }}
                  />
                  {errors.phoneNumber && (
                    <p style={{ fontSize: "10px", color: "#f44336", margin: "3px 0 0 0" }}>
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
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#424242",
                    marginBottom: "4px",
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
                    padding: "8px 10px",
                    borderRadius: "6px",
                    border: `1px solid ${errors.college ? "#f44336" : "#e0e0e0"}`,
                    fontSize: "12px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    backgroundColor: "#f9f9f9",
                  }}
                />
                {errors.college && (
                  <p style={{ fontSize: "10px", color: "#f44336", margin: "3px 0 0 0" }}>
                    {errors.college}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#424242",
                    marginBottom: "4px",
                  }}
                >
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Main St, City, State"
                  value={formData.address}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    border: `1px solid ${errors.address ? "#f44336" : "#e0e0e0"}`,
                    fontSize: "12px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    backgroundColor: "#f9f9f9",
                  }}
                />
                {errors.address && (
                  <p style={{ fontSize: "10px", color: "#f44336", margin: "3px 0 0 0" }}>
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Password and Confirm Password Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ position: "relative" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#424242",
                      marginBottom: "4px",
                    }}
                  >
                    Password
                  </label>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    style={{
                      width: "100%",
                      padding: "8px 36px 8px 10px",
                      borderRadius: "6px",
                      border: `1px solid ${errors.password ? "#f44336" : "#e0e0e0"}`,
                      fontSize: "12px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      backgroundColor: "#f9f9f9",
                    }}
                  />

                  {/* Eye Icon */}
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "32px",
                      cursor: "pointer",
                      fontSize: "16px",
                      color: "#555",
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>

                  {errors.password && (
                    <p style={{ fontSize: "10px", color: "#f44336", margin: "3px 0 0 0" }}>
                      {errors.password}
                    </p>
                  )}
                </div>



                <div style={{ position: "relative" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#424242",
                      marginBottom: "4px",
                    }}
                  >
                    Confirm Password
                  </label>

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    style={{
                      width: "100%",
                      padding: "8px 36px 8px 10px",
                      borderRadius: "6px",
                      border: `1px solid ${errors.confirmPassword ? "#f44336" : "#e0e0e0"}`,
                      fontSize: "12px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      backgroundColor: "#f9f9f9",
                    }}
                  />

                  {/* Eye Icon */}
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "32px",
                      cursor: "pointer",
                      fontSize: "16px",
                      color: "#555",
                    }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>

                  {errors.confirmPassword && (
                    <p style={{ fontSize: "10px", color: "#f44336", margin: "3px 0 0 0" }}>
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
                padding: "10px 16px",
                backgroundColor: isLoading ? "#e0e0e0" : "#fdd835",
                color: isLoading ? "#757575" : "#1a2332",
                fontSize: "14px",
                fontWeight: "700",
                border: "none",
                borderRadius: "6px",
                cursor: isLoading ? "not-allowed" : "pointer",
                marginTop: "14px",
                transition: "background-color 0.3s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "#f9c802";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "#fdd835";
                }
              }}
            >
              {isLoading ? "Registering..." : "Create Account"}
            </button>

            {/* Login Link */}
            <div style={{ textAlign: "center", fontSize: "12px", color: "#757575", marginTop: "12px" }}>
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#fdd835",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "12px",
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