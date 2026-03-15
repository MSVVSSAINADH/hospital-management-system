import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaUser, FaBuilding, FaTrash, FaUndo, FaPhone, FaEnvelope, FaEdit, FaBriefcase, FaIdBadge } from 'react-icons/fa';
import { MdPerson, MdCalendarToday } from 'react-icons/md';
import styles from './ManageStaff.module.css';
import Modal from '../common/Modal';

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    role: '', 
    department: '', 
    mobile: '', 
    email: '', 
    workToday: true 
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";
  const API_URL = `${apiBase}/api/staff`;

  const getAuthHeader = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    return user && user.token ? { 'Authorization': `Bearer ${user.token}` } : {};
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${API_URL}${showDeleted ? '?showDeleted=true' : ''}`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (res.ok) setStaffMembers(data);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [showDeleted]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedStaff(null);
    setFormData({ name: '', role: '', department: '', mobile: '', email: '', workToday: true });
    setIsModalOpen(true);
  };

  const openEditModal = (staff) => {
    setIsEditMode(true);
    setSelectedStaff(staff);
    setFormData({ 
      name: staff.name, 
      role: staff.role, 
      department: staff.department, 
      mobile: staff.mobile || '', 
      email: staff.email || '', 
      workToday: staff.workToday 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode ? `${API_URL}/${selectedStaff.id}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        fetchStaff();
        setIsModalOpen(false);
      } else {
        const error = await res.json();
        alert(error.message || 'Action failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Try again later.');
    }
  };

  const toggleWorkStatus = async (staff) => {
    try {
      const res = await fetch(`${API_URL}/${staff.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ workToday: !staff.workToday }),
      });
      if (res.ok) {
        setStaffMembers(prev =>
          prev.map(s => (s.id === staff.id ? { ...s, workToday: !s.workToday } : s))
        );
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const deleteStaff = async (id) => {
    if (!window.confirm('Mark this staff member as inactive/deleted?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}/delete`, { 
        method: 'PATCH',
        headers: { ...getAuthHeader() }
      });
      if (res.ok) {
        fetchStaff();
      }
    } catch (err) {
      console.error('Failed to delete staff:', err);
    }
  };

  const restoreStaff = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/restore`, { 
        method: 'PATCH',
        headers: { ...getAuthHeader() }
      });
      if (res.ok) {
        fetchStaff();
      }
    } catch (err) {
      console.error('Failed to restore staff:', err);
    }
  };

  const filteredStaffMembers = staffMembers.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Hospital Staff Registry</h1>
          <p className={styles.subtitle}>Administrative record management for non-medical and support staff.</p>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, role, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.addBtn} onClick={openAddModal}>
            <FaPlus /> Add Personnel
          </button>
          <button
            className={`${styles.filterBtn} ${showDeleted ? styles.activeFilter : ''}`}
            onClick={() => setShowDeleted(prev => !prev)}
          >
            {showDeleted ? <FaUndo /> : <FaTrash />}
            {showDeleted ? ' View Active Registry' : ' View Archived Records'}
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {filteredStaffMembers.length > 0 ? (
          <table className={styles.staffTable}>
            <thead>
              <tr>
                <th><FaIdBadge /> Staff ID</th>
                <th><FaUser /> Name & Role</th>
                <th><FaPhone /> Contact Info</th>
                <th><FaBuilding /> Department</th>
                <th>Status</th>
                <th>Acquired On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffMembers.map(staff => (
                <tr key={staff.id} className={staff.deleted ? styles.rowDeleted : ''}>
                  <td className={styles.staffId}>#{staff.id}</td>
                  <td>
                    <div className={styles.personCell}>
                      <div className={styles.personIcon}>
                        <MdPerson />
                      </div>
                      <div>
                        <div className={styles.staffName}>{staff.name}</div>
                        <div className={styles.staffRole}>{staff.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.contactCell}>
                      <div><FaPhone size={12} color="#6366f1" /> {staff.mobile || 'N/A'}</div>
                      <div><FaEnvelope size={12} color="#6366f1" /> {staff.email || 'N/A'}</div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.deptBadge}><FaBuilding /> {staff.department}</span>
                  </td>
                  <td>
                    {!staff.deleted && (
                      <div className={styles.statusToggle}>
                        <label className={styles.switch}>
                          <input
                            type="checkbox"
                            checked={staff.workToday}
                            onChange={() => toggleWorkStatus(staff)}
                          />
                          <span className={`${styles.slider} ${styles.round}`}></span>
                        </label>
                        <span className={styles.statusLabel} style={{ color: staff.workToday ? '#10b981' : '#ef4444' }}>
                          {staff.workToday ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                    )}
                    {staff.deleted && <span className={styles.archivedLabel}>ARCHIVED</span>}
                  </td>
                  <td className={styles.dateCell}>
                    <MdCalendarToday /> {staff.dateAdded || '---'}
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      {!staff.deleted ? (
                        <>
                          <button onClick={() => openEditModal(staff)} className={styles.iconBtn} title="Edit Record">
                            <FaEdit />
                          </button>
                          <button onClick={() => deleteStaff(staff.id)} className={`${styles.iconBtn} ${styles.delete}`} title="Archive">
                            <FaTrash />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => restoreStaff(staff.id)} className={styles.restoreBtn}>
                          <FaUndo /> Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <p>No personnel records matching your criteria.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className={styles.modalWrapper}>
            <div className={styles.modalHeader}>
              <div className={styles.modalAvatar}>
                <FaUser />
              </div>
              <h2 className={styles.modalTitle}>{isEditMode ? 'Update Staff Record' : 'Register New Personnel'}</h2>
              <p className={styles.modalSubtitle}>{isEditMode ? 'Update details for this hospital staff member.' : 'Enter detailed information for the new hospital team member.'}</p>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.staffForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label><FaUser className={styles.labelIcon} /> Full Name</label>
                  <input name="name" type="text" value={formData.name} onChange={handleInputChange} required placeholder="e.g. John Doe" />
                </div>
                <div className={styles.formGroup}>
                  <label><FaEnvelope className={styles.labelIcon} /> Email Address</label>
                  <input name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="name@klhospitals.in" />
                </div>
                <div className={styles.formGroup}>
                  <label><FaPhone className={styles.labelIcon} /> Mobile Number</label>
                  <input name="mobile" type="text" value={formData.mobile} onChange={handleInputChange} required placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className={styles.formGroup}>
                  <label><FaBriefcase className={styles.labelIcon} /> Job Role</label>
                  <input name="role" type="text" value={formData.role} onChange={handleInputChange} required placeholder="e.g. Nurse, Pharmacist" />
                </div>
                <div className={styles.formGroup}>
                  <label><FaBuilding className={styles.labelIcon} /> Department</label>
                  <input name="department" type="text" value={formData.department} onChange={handleInputChange} required placeholder="e.g. Cardiology, Outpatient" />
                </div>
                <div className={styles.formGroup}>
                  <label>Initial Status</label>
                  <label className={styles.checkboxLabel}>
                    <input name="workToday" type="checkbox" checked={formData.workToday} onChange={handleInputChange} />
                    <span>Set as Active Status</span>
                  </label>
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>
                  {isEditMode ? 'Update Record' : 'Register Personnel'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StaffManagement;
