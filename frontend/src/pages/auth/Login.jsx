import { useState } from "react";
import axios from "../../api/axios"; // base URL

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("/accounts/login/", {
        email,
        password,
      });

      const userType = res.data.user_type;

      if (userType === "member") window.location.href = "/member/dashboard";
      if (userType === "librarian") window.location.href = "/librarian/dashboard";
      if (userType === "admin") window.location.href = "/admin/dashboard";
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <button className="forgot">Forgot Password?</button>

      <p>No account? <a href="/register">Create one</a></p>
    </div>
  );
}
