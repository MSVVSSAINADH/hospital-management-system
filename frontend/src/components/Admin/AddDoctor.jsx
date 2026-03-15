import React, { useState } from "react";
import axios from "axios";
import { FaUserMd, FaEnvelope, FaPhone, FaStethoscope, FaBuilding, FaKey, FaUserTag } from 'react-icons/fa';
import styles from './ManageDoctors.module.css'; // Reusing premium styles

const AddDoctor = () => {
  const [doctor, setDoctor] = useState({
    name: "",
    username: "",
    password: "",
    specialization: "",
    department: "",
    email: "",
    phone: "",
    status: "ACTIVE"
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDoctor({ 
      ...doctor, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";
      await axios.post(`${apiBase}/api/doctors`, doctor);
      alert("Doctor registered successfully!");
      setDoctor({ 
        name: "", 
        username: "",
        password: "",
        specialization: "", 
        department: "Cardiology Dept", // Default for better UX
        email: "", 
        phone: "", 
        status: "ACTIVE" 
      });
    } catch (error) {
      console.error("Error adding doctor:", error);
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      alert(`Error ${status || ''}: ${message}. Please check if the backend is running on port 8086.`);
    }
  };

  return (
    <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className={styles.tableContainer} style={{ width: '100%', maxWidth: '850px', padding: '3rem' }}>
        <div className={styles.header} style={{ border: 'none', textAlign: 'center', padding: 0 }}>
          <div className={styles.doctorAvatar} style={{ margin: '0 auto 1.5rem', width: '70px', height: '70px', fontSize: '2.5rem' }}>
            <FaUserMd />
          </div>
          <h2 className={styles.title} style={{ fontSize: '2.2rem' }}>Register New Doctor</h2>
          <p className={styles.subtitle} style={{ margin: '0 auto' }}>Create a secure account for a new medical professional.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} style={{ marginTop: '2rem' }}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label><FaUserMd style={{ marginRight: '8px', color: '#6366f1' }} /> Full Name</label>
              <input
                type="text"
                name="name"
                value={doctor.name}
                onChange={handleChange}
                placeholder="Dr. John Doe"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label><FaStethoscope style={{ marginRight: '8px', color: '#6366f1' }} /> Specialization</label>
              <input
                type="text"
                name="specialization"
                value={doctor.specialization}
                onChange={handleChange}
                placeholder="Cardiology"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label><FaBuilding style={{ marginRight: '8px', color: '#6366f1' }} /> Department</label>
              <input
                type="text"
                name="department"
                value={doctor.department}
                onChange={handleChange}
                placeholder="Cardiology Dept"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label><FaEnvelope style={{ marginRight: '8px', color: '#6366f1' }} /> Email Address</label>
              <input
                type="email"
                name="email"
                value={doctor.email}
                onChange={handleChange}
                placeholder="john.doe@hospital.com"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label><FaUserTag style={{ marginRight: '8px', color: '#6366f1' }} /> Username</label>
              <input
                type="text"
                name="username"
                value={doctor.username}
                onChange={handleChange}
                placeholder="johndoe123"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label><FaKey style={{ marginRight: '8px', color: '#6366f1' }} /> Password</label>
              <input
                type="password"
                name="password"
                value={doctor.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label><FaPhone style={{ marginRight: '8px', color: '#6366f1' }} /> Phone Number</label>
              <input
                type="text"
                name="phone"
                value={doctor.phone}
                onChange={handleChange}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Initial Status</label>
              <select 
                name="status" 
                value={doctor.status} 
                onChange={handleChange}
                style={{ appearance: 'none', cursor: 'pointer' }}
              >
                <option value="ACTIVE">Active (Allowed to Login)</option>
                <option value="INACTIVE">Inactive (Blocked)</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className={styles.submitBtn}
            style={{ width: '100%', marginTop: '2rem', padding: '1rem' }}
          >
            Register Doctor & Enable Access
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
