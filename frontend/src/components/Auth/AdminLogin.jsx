import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { userApi } from "../../api";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    // Map "admin" to "admin@klhospitals.in" for convenience
    const emailToUse = email.trim().toLowerCase() === "admin" ? "admin@klhospitals.in" : email.trim();

    try {
      const res = await userApi.loginUser(emailToUse, password);
      const data = res.data;
      
      if (data.user && data.user.role === "admin") {
        // Flatten the object so Header.jsx can read user.role directly, and api.js can read user.token
        const flatUserData = { ...data.user, token: data.token };
        login(flatUserData);
        sessionStorage.setItem("user", JSON.stringify(flatUserData));
        navigate("/admin/dashboard");
      } else {
        alert("Access Denied: Not an admin account.");
      }
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.message || err.response?.statusText || "No server response";
      alert(`Login Failed!\n\nReason: ${err.message}\nServer: ${serverMsg}`);
    }
  };

  return (
    <div className="admin-login-container">
      {/* Decorative background blur blobs for premium glassmorphic effect */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="admin-login-box">
        <div className="login-header">
          <h2>Admin Portal Login</h2>
          <p className="access-note">Access restricted to authorized personnel only.</p>
        </div>
        <form onSubmit={handleAdminLogin} className="admin-login-form">
          <div className="input-group">
            <label>Admin Email (or 'admin')</label>
            <div className="input-with-icon">
              <Mail className="lucide-icon" size={20} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              />
            </div>
          </div>
          <button type="submit" className="login-button">
            Sign In to Dashboard
          </button>
          <p className="forgot-password">Forgot Password?</p>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
