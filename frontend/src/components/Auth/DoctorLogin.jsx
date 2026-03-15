import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaLock, FaUser, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import "./DoctorLogin.css";

const DoctorLogin = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isInactive, setIsInactive] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Redirect if already logged in
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsInactive(false);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";
      const res = await fetch(`${apiBase}/api/doctors/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password }), // Identifer passed as 'email' to match backend request DTO
      });

      const data = await res.json();

      if (res.ok) {
        // Prepare user data for context
        const userData = {
          ...data.doctor,
          token: data.token,
          role: "doctor" // Ensure role is set for routing
        };

        login(userData);
        sessionStorage.setItem("user", JSON.stringify(userData));
        navigate("/doctor/dashboard");
      } else {
        if (data.message && data.message.includes("inactive")) {
          setIsInactive(true);
        }
        setError(data.message || "Invalid credentials!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="doctor-login-container">
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="login-box">
        <div className="login-header">
          <div className="doctor-icon-wrapper">
            <FaUserMd size={32} />
          </div>
          <h2>Doctor Portal</h2>
          <p>Sign in to access your dashboard and manage patients.</p>
        </div>

        {isInactive && (
          <div className="inactive-alert">
            <FaExclamationTriangle size={20} />
            <span>Your account is currently inactive. Please contact the administrator.</span>
          </div>
        )}

        {error && !isInactive && (
          <div className="inactive-alert" style={{ background: '#fff7ed', borderColor: '#fed7aa', color: '#c2410c' }}>
            <FaExclamationTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Username or Email</label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="Enter your username or email"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
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
            Access Dashboard
          </button>
        </form>

        <div className="back-to-portal">
          <a href="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FaArrowLeft size={12} /> Back to Main Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
