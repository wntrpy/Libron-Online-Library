import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../../assets/libron_login.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setStatus({ type: "error", message: "Kindly enter an email address." });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/api/accounts/forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to process your request right now.");
      }

      setStatus({
        type: "success",
        message: data.message || "Please check your inbox for your new password.",
      });
      setEmail("");
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a2332",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          backgroundColor: "white",
          borderRadius: "24px",
          overflow: "hidden",
          maxWidth: "960px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            backgroundColor: "#111827",
            padding: "40px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div>
            <p style={{ letterSpacing: "0.2em", fontSize: "12px", color: "#fdd835" }}>
              LIBRON LIBRARY
            </p>
            <h1 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "16px" }}>
              Forgot your password?
            </h1>
            <p style={{ color: "#b0bec5", fontSize: "16px", lineHeight: 1.6 }}>
              Enter the email tied to your member account. We will generate a brand-new password
              for you and send it straight to your inbox.
            </p>
          </div>
          <img
            src={loginImage}
            alt="Library Illustration"
            style={{ width: "100%", maxHeight: "320px", objectFit: "contain" }}
          />
        </div>

        <div style={{ padding: "40px" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1a2332",
                  marginBottom: "10px",
                }}
              >
                Member email
              </label>
              <input
                id="email"
                type="email"
                placeholder="yourname@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  fontSize: "15px",
                  fontFamily: "inherit",
                  backgroundColor: "#f9fafb",
                }}
              />
            </div>

            {status.message && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  color: status.type === "success" ? "#065f46" : "#7f1d1d",
                  backgroundColor: status.type === "success" ? "#d1fae5" : "#fee2e2",
                  border: `1px solid ${status.type === "success" ? "#10b981" : "#f87171"}`,
                }}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: "12px",
                backgroundColor: loading ? "#fbe475" : "#fdd835",
                color: "#1a2332",
                fontSize: "16px",
                fontWeight: 700,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "transform 0.2s ease, background-color 0.2s ease",
                marginBottom: "16px",
              }}
              onMouseOver={(event) => {
                if (!loading) {
                  event.currentTarget.style.transform = "translateY(-2px)";
                  event.currentTarget.style.backgroundColor = "#f9c802";
                }
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = "translateY(0)";
                event.currentTarget.style.backgroundColor = loading ? "#fbe475" : "#fdd835";
              }}
            >
              {loading ? "Sending..." : "Send me a new password"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              width: "100%",
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              color: "#1a2332",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
