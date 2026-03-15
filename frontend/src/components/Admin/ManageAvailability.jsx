import React, { useState, useEffect, useContext } from 'react';
import styles from './ManageAvailability.module.css';
import { FaCalendarPlus, FaUserMd, FaClock, FaBan, FaCheckCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const ManageAvailability = () => {
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    doctorName: '',
    date: '',
    selectedSlots: [],
  });

  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '05:00 PM - 07:00 PM',
    '07:00 PM - 09:00 PM',
    '09:00 PM - 10:00 PM',
  ];

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8086';

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/doctors`);
        setDoctors(res.data || []);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };
    fetchDoctors();
    fetchCurrentBlocks();
  }, [apiBase]);

  const fetchCurrentBlocks = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${apiBase}/api/availability`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      setBlockedSlots(res.data || []);
    } catch (err) {
      console.error('Error fetching blocked slots:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'doctorId') {
      const selectedDoctor = doctors.find(doc => doc.id.toString() === value);
      setFormData({
        ...formData,
        doctorId: value,
        doctorName: selectedDoctor ? selectedDoctor.name : ''
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSlotToggle = (slot) => {
    const updatedSlots = formData.selectedSlots.includes(slot)
      ? formData.selectedSlots.filter(s => s !== slot)
      : [...formData.selectedSlots, slot];
    setFormData({ ...formData, selectedSlots: updatedSlots });
  };

  const handleBlockSlots = async (e) => {
    e.preventDefault();
    if (!user || formData.selectedSlots.length === 0) {
      alert('Please select at least one slot to block.');
      return;
    }

    setLoading(true);
    try {
      const payload = formData.selectedSlots.map(slot => ({
        doctorId: parseInt(formData.doctorId),
        doctorName: formData.doctorName,
        date: formData.date,
        timeSlot: slot,
        status: 'UNAVAILABLE',
        isBooked: false
      }));

      await axios.post(`${apiBase}/api/availability/block/batch`, payload, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      alert('Slots blocked successfully!');
      setFormData({ ...formData, selectedSlots: [] }); // Clear selected slots
      fetchCurrentBlocks();
    } catch (error) {
      console.error('Error blocking slots:', error);
      alert('Failed to block slots.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (id) => {
    if (!window.confirm('Are you sure you want to make this slot available again?')) return;
    try {
      await axios.delete(`${apiBase}/api/availability/${id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      alert('Slot unblocked.');
      fetchCurrentBlocks();
    } catch (err) {
      console.error('Error unblocking slot:', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}><FaCalendarPlus /> Manage Doctor Schedule</h1>
        <p className={styles.subtitle}>Click to select multiple time slots to mark them as unavailable.</p>
        
        <form onSubmit={handleBlockSlots} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}><FaUserMd /> Doctor</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">-- Select a Doctor --</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}><FaClock /> Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}><FaClock /> Select Time Slots to Block</label>
            <div className={styles.slotGrid}>
              {timeSlots.map((slot, index) => (
                <div key={index} className={styles.slotItem}>
                  <input
                    type="checkbox"
                    id={`slot-${index}`}
                    className={styles.slotCheckbox}
                    checked={formData.selectedSlots.includes(slot)}
                    onChange={() => handleSlotToggle(slot)}
                  />
                  <label htmlFor={`slot-${index}`} className={styles.slotContent}>
                    {slot}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading || formData.selectedSlots.length === 0}>
            <FaBan /> {loading ? 'Blocking...' : `Block ${formData.selectedSlots.length} Selected Slots`}
          </button>
        </form>

        {blockedSlots.length > 0 && (
          <div className={styles.blockList} style={{ marginTop: '2.5rem' }}>
            <h2 className={styles.title} style={{ fontSize: '1.3rem' }}>Blocked Slots (Unavailability)</h2>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                <thead>
                    <tr>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Slot</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {blockedSlots.map(slot => (
                    <tr key={slot.id}>
                        <td>{slot.doctorName}</td>
                        <td>{slot.date}</td>
                        <td style={{ fontWeight: '600', color: '#d32f2f' }}>{slot.timeSlot}</td>
                        <td>
                        <button onClick={() => handleUnblock(slot.id)} className={styles.unblockBtn}>
                            <FaCheckCircle style={{ marginRight: '4px' }} /> Restore
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAvailability;
