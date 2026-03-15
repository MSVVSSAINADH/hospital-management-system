import React, { useEffect, useState, useContext } from 'react';
import styles from './ViewAppointments.module.css';
import { FaEye, FaTrashAlt, FaClock, FaUserMd, FaCalendarAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const ViewAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8086';

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`${apiBase}/api/bookings`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        setAppointments(res.data || []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user, apiBase]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await axios.patch(`${apiBase}/api/bookings/${id}/cancel`, {}, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        alert('Appointment cancelled successfully!');
        // Refresh list
        setAppointments(appointments.map(app => app.id === id ? { ...app, status: 'cancelled' } : app));
      } catch (err) {
        console.error('Error cancelling appointment:', err);
        alert('Failed to cancel appointment.');
      }
    }
  };

  if (loading) return <div className={styles.container}><p>Loading appointments...</p></div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}><FaEye /> All Patient Appointments</h2>
        <p className={styles.subtitle}>Overview of all consultations across the hospital system.</p>
        
        {appointments.length === 0 ? (
          <p className={styles.noDataMessage}>No appointments available.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th><FaUserMd /> Doctor</th>
                  <th><FaCalendarAlt /> Date</th>
                  <th><FaClock /> Time Slot</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.doctor}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.timeSlot}</td>
                    <td>
                      <span className={styles.statusBadge} style={{ 
                        background: appointment.status === 'booked' ? '#e3f2fd' : '#ffebee',
                        color: appointment.status === 'booked' ? '#1976d2' : '#d32f2f',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {appointment.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{appointment.description}</td>
                    <td>
                      {appointment.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className={styles.deleteBtn}
                          style={{ background: '#ffebee', color: '#d32f2f', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          <FaTrashAlt /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAppointments;