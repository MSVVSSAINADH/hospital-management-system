import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaUserMd, FaBuilding, FaTrash, FaUndo, FaEnvelope, FaPhone, FaStethoscope, FaKey, FaUserTag } from 'react-icons/fa';
import styles from './ManageDoctors.module.css';
import Modal from '../common/Modal';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({ 
    name: '', 
    username: '',
    password: '',
    specialization: '', 
    department: '', 
    email: '', 
    phone: '', 
    status: 'ACTIVE' 
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";
  const API_URL = `${apiBase}/api/doctors`;

  // Helper to get token
  const getAuthHeader = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    return user && user.token ? { 'Authorization': `Bearer ${user.token}` } : {};
  };

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${API_URL}${showDeleted ? '?showDeleted=true' : ''}`, {
          headers: { ...getAuthHeader() }
        });
        const data = await res.json();
        if (res.ok) setDoctors(data);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      }
    };
    fetchDoctors();
  }, [showDeleted]);

  // Add doctor
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.username || !newDoctor.password || !newDoctor.specialization || !newDoctor.department || !newDoctor.email) {
       alert("Please fill in all required fields including login credentials.");
       return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(newDoctor),
      });
      const savedDoctor = await res.json();
      if (res.ok) {
        setDoctors(prev => [...prev, savedDoctor]);
        setNewDoctor({ 
          name: '', 
          username: '',
          password: '',
          specialization: '', 
          department: '', 
          email: '', 
          phone: '', 
          status: 'ACTIVE' 
        });
        setIsModalOpen(false);
      } else {
        const errorMsg = savedDoctor.message || 'Failed to add doctor';
        alert(`Error ${res.status}: ${errorMsg}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Server error or connection failed. Please check if the backend is running on port 8086.`);
    }
  };

  // Toggle status (ACTIVE/INACTIVE)
  const toggleStatus = async (id) => {
    const doctor = doctors.find(d => d.id === id);
    const newStatus = doctor.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updatedDoctor = await res.json();
        setDoctors(prev =>
          prev.map(d => (d.id === id ? updatedDoctor : d))
        );
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Soft delete doctor
  const deleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}/delete`, { 
        method: 'PATCH',
        headers: { ...getAuthHeader() }
      });
      if (res.ok) {
        setDoctors(prev => prev.map(d => d.id === id ? { ...d, deleted: true } : d));
      }
    } catch (err) {
      console.error('Failed to delete doctor:', err);
    }
  };

  // Restore doctor
  const restoreDoctor = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/restore`, { 
        method: 'PATCH',
        headers: { ...getAuthHeader() }
      });
      if (res.ok) {
        setDoctors(prev => prev.map(d => d.id === id ? { ...d, deleted: false } : d));
      }
    } catch (err) {
      console.error('Failed to restore doctor:', err);
    }
  };

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Doctor Management</h1>
        <p className={styles.subtitle}>Manage doctor accounts, credentials, and control their access to the portal.</p>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, username, specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.toggleDeletedBtn} onClick={() => setShowDeleted(prev => !prev)}>
            {showDeleted ? <FaUndo /> : <FaTrash />}
            {showDeleted ? 'Show Active' : 'Show Deleted'}
          </button>
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            <FaPlus /> Add New Doctor
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {filteredDoctors.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Doctor Details</th>
                <th>Credentials</th>
                <th>Specialization</th>
                <th>Contact Info</th>
                <th>Account Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map(doctor => (
                <tr key={doctor.id} style={{ opacity: doctor.deleted ? 0.6 : 1 }}>
                  <td>
                    <div className={styles.doctorName}>
                      <div className={styles.doctorAvatar}>
                        <FaUserMd />
                      </div>
                      <div>
                        <div>{doctor.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaBuilding size={12} /> {doctor.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem', color: '#475569' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaUserTag size={12} color="#6366f1" /> {doctor.username}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>••••••••</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaStethoscope color="#6366f1" />
                      {doctor.specialization}
                    </div>
                  </td>
                  <td>
                    <div className={styles.contactInfo}>
                      <span><FaEnvelope size={12} /> {doctor.email}</span>
                      <span><FaPhone size={12} /> {doctor.phone || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    {!doctor.deleted ? (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={doctor.status === 'ACTIVE'}
                            onChange={() => toggleStatus(doctor.id)}
                          />
                          <span className={styles.slider}></span>
                        </label>
                        <span className={`${styles.statusBadge} ${doctor.status === 'ACTIVE' ? styles.available : styles.unavailable}`}>
                          {doctor.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ) : (
                      <span className={`${styles.statusBadge} ${styles.unavailable}`}>Deleted</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {!doctor.deleted ? (
                        <button onClick={() => deleteDoctor(doctor.id)} className={`${styles.actionBtn} ${styles.deleteAction}`} title="Delete Doctor">
                          <FaTrash />
                        </button>
                      ) : (
                        <button onClick={() => restoreDoctor(doctor.id)} className={`${styles.actionBtn} ${styles.restoreAction}`} title="Restore Doctor">
                          <FaUndo />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noMessage}>No doctors found matching your criteria.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title} style={{ fontSize: '1.8rem' }}>Add New Doctor</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input type="text" placeholder="Dr. John Doe" value={newDoctor.name} onChange={e => setNewDoctor(prev => ({ ...prev, name: e.target.value }))} required />
              </div>
              <div className={styles.formGroup}>
                <label>Specialization</label>
                <input type="text" placeholder="Cardiology" value={newDoctor.specialization} onChange={e => setNewDoctor(prev => ({ ...prev, specialization: e.target.value }))} required />
              </div>
              <div className={styles.formGroup}>
                <label>Department</label>
                <input type="text" placeholder="Cardiology Dept" value={newDoctor.department} onChange={e => setNewDoctor(prev => ({ ...prev, department: e.target.value }))} required />
              </div>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input type="email" placeholder="john.doe@hospital.com" value={newDoctor.email} onChange={e => setNewDoctor(prev => ({ ...prev, email: e.target.value }))} required />
              </div>
              <div className={styles.formGroup}>
                <label>Username</label>
                <input type="text" placeholder="johndoe123" value={newDoctor.username} onChange={e => setNewDoctor(prev => ({ ...prev, username: e.target.value }))} required />
              </div>
              <div className={styles.formGroup}>
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type="password" placeholder="••••••••" value={newDoctor.password} onChange={e => setNewDoctor(prev => ({ ...prev, password: e.target.value }))} required />
                  <FaKey style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={14} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input type="text" placeholder="+1 234 567 890" value={newDoctor.phone} onChange={e => setNewDoctor(prev => ({ ...prev, phone: e.target.value }))} />
              </div>
              <div className={styles.formGroup}>
                <label>Initial Status</label>
                <select value={newDoctor.status} onChange={e => setNewDoctor(prev => ({ ...prev, status: e.target.value }))}>
                  <option value="ACTIVE">Active (Allowed to Login)</option>
                  <option value="INACTIVE">Inactive (Blocked)</option>
                </select>
              </div>
            </div>
            <button type="submit" className={styles.submitBtn}>Register Doctor</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ManageDoctors;
