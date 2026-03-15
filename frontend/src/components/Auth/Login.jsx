import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // ✅ Redirect to dashboard if already logged in
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/view-booking");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";
      const res = await fetch(`${apiBase}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Flatten user object so Context and Header can read `user.role` directly
        const flatUserData = { ...data.user, token: data.token };

        // ✅ Store user in AuthContext and sessionStorage
        login(flatUserData);
        sessionStorage.setItem("user", JSON.stringify(flatUserData));

        // ✅ Redirect based on role
        if (flatUserData.role === "admin") {
          navigate("/admin/dashboard");
        } else if (flatUserData.role === "doctor") {
          navigate("/doctor/dashboard");
        } else {
          navigate("/view-booking");
        }
      } else {
        alert(data.message || "Invalid credentials!");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="login-container">
      {/* Decorative background blur blobs for premium glassmorphic effect */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="login-box">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail className="lucide-icon" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock className="lucide-icon" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            Sign In Securely
          </button>

          <p className="forgot-password">Forgot your password?</p>

          {/* ✅ Added Doctor Login link */}
          <p className="admin-text" style={{ borderTop: 'none', marginTop: '0.5rem', paddingTop: 0 }}>
            Are you a doctor?{" "}
            <a href="/doctor/login" className="admin-link" style={{ color: '#6366f1' }}>
              Doctor Portal
            </a>
          </p>

          {/* ✅ Added Admin Login link */}
          <p className="admin-text">
            Are you an admin?{" "}
            <a href="/admin/login" className="admin-link">
              Admin Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
