import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DoctorDashboard.module.css';
import { FaUsers, FaCalendarAlt, FaClipboardList, FaStethoscope } from 'react-icons/fa';
import Card from '../../components/common/Card';
import { AuthContext } from '../context/AuthContext';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";

  const fetchQueue = async () => {
    const doctorId = user?.id;
    console.log("DEBUG: Dashboard fetching for Doctor ID:", doctorId);
    if (!doctorId) {
        console.warn("DEBUG: No doctorId found in user session!");
        setLoading(false);
        return;
    }
    const doctorName = user?.name || user?.fullName;
    try {
      const response = await fetch(`${apiBase}/api/doctor/dashboard/patient-queue/${doctorId}?doctorName=${encodeURIComponent(doctorName || '')}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("DEBUG: Received queue data:", data);
        setQueue(data);
      } else {
        const errText = await response.text();
        console.error(`Dashboard fetch failed: ${response.status} - ${errText}`);
      }
    } catch (err) {
      console.error('Failed to fetch queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    // Auto-refresh queue every 30 seconds for live feel
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, [user, apiBase]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`${apiBase}/api/doctor/dashboard/booking/${id}/status?status=${newStatus}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      
      if (res.ok) {
        // Automatically Notify Patient if they are being called
        if (newStatus === 'in_progress') {
           const booking = queue.find(b => b.id === id);
           if (booking) {
             const notifyPayload = {
               userId: booking.userId,
               title: "It's your turn!",
               message: `Dr. ${user.name} is ready for you. Please head to the consultation room.`,
               type: "alert"
             };
             fetch(`${apiBase}/api/notifications`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
               body: JSON.stringify(notifyPayload)
             }).catch(e => console.error("Notification failed", e));
           }
        }
        fetchQueue(); // Refresh
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const currentPatient = queue.find(b => b.consultationStatus === 'in_progress');
  const enqueuedPatients = queue.filter(b => !b.consultationStatus || b.consultationStatus === 'enqueued');
  const finishedPatients = queue.filter(b => b.consultationStatus === 'completed');

  if (loading) return <div className={styles.loading}>Loading Scheduler...</div>;

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}><FaStethoscope /> Clinical Dashboard</h1>
        <p className={styles.subtitle}>Welcome, Dr. {user?.name}. Manage your live consultation queue here.</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <h3>Waiting</h3>
          <p className={styles.statVal}>{enqueuedPatients.length}</p>
        </div>
        <div className={styles.statBox}>
          <h3>Seen Today</h3>
          <p className={styles.statVal}>{finishedPatients.length}</p>
        </div>
      </div>

      <div className={styles.dailyQueue}>
        <section className={styles.currentConsultation}>
          <h2 className={styles.sectionTitle}>Active Consultation</h2>
          {currentPatient ? (
            <div className={styles.activeCard}>
              <div className={styles.patientInfo}>
                <span className={styles.badge}>Live Now</span>
                <h3>{currentPatient.patientName || `Patient ${currentPatient.userId}`}</h3>
                <p>{currentPatient.timeSlot}</p>
              </div>
              <div className={styles.activeActions}>
                <button 
                  className={styles.finishBtn}
                  onClick={() => navigate('/doctor/consultation-room', { state: { booking: currentPatient } })}
                >
                  Enter Consultation Room & Issue Prescription
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyActive}>
              <p>No active consultation. Start with the next patient in queue.</p>
            </div>
          )}
        </section>

        <section className={styles.waitlist}>
          <h2 className={styles.sectionTitle}>Next Patients</h2>
          <div className={styles.queueList}>
            {enqueuedPatients.length > 0 ? enqueuedPatients.map((booking, index) => (
              <div key={booking.id} className={styles.queueItem}>
                <div className={styles.pos}>{index + 1}</div>
                <div className={styles.qDetails}>
                  <strong>{booking.patientName || `Patient ${booking.userId}`}</strong>
                  <span>{booking.timeSlot}</span>
                </div>
                <button 
                   className={styles.startBtn}
                   onClick={() => handleStatusUpdate(booking.id, 'in_progress')}
                   disabled={!!currentPatient}
                >
                  Call Patient
                </button>
              </div>
            )) : (
              <p className={styles.noQueue}>All caught up! No more patients waiting.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;