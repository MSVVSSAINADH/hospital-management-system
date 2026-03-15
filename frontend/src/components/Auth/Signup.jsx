import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, MapPin } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import "./Signup.css";

const useStatusMessage = () => {
  const [message, setMessage] = useState({ text: "", type: "" });
  const showMessage = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };
  return [message, showMessage];
};

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const [statusMessage, showStatusMessage] = useStatusMessage();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showStatusMessage("Passwords do not match.", "error");
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5101";
      const res = await fetch(`${apiBase}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          mobile,
          address,
          role: "user", // Defaulting role to 'user'
        }),
      });

      const data = await res.json();
      showStatusMessage(
        data.message || "Something went wrong",
        res.ok ? "success" : "error"
      );

      if (res.ok) {
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setMobile("");
        setAddress("");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      console.error(err);
      showStatusMessage("Server error. Please try again.", "error");
    }
  };

  const isFormValid =
    fullName && email && password && confirmPassword && mobile && address;

  return (
    <div className="login-container">
      {/* Decorative background blur blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="login-box">
        <div className="login-header">
          <h2>Create Your Account</h2>
          <p className="signup-link">
            Already a member? <a href="/login">Sign in</a>
          </p>
        </div>

        {statusMessage.text && (
          <div className={`status-message ${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-with-icon">
              <User className="lucide-icon" size={20} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email</label>
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

          {/* Mobile */}
          <div className="input-group">
            <label>Mobile</label>
            <div className="input-with-icon">
              <Phone className="lucide-icon" size={20} />
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                placeholder="Enter your mobile number"
              />
            </div>
          </div>

          {/* Address */}
          <div className="input-group">
            <label>Address</label>
            <div className="input-with-icon">
              <MapPin className="lucide-icon" size={20} />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Enter your address"
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock className="lucide-icon" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Choose a strong password"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-with-icon">
              <Lock className="lucide-icon" size={20} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="login-button"
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
