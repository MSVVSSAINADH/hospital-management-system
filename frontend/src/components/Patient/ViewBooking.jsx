import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ViewBooking.module.css';
import { 
  FaCalendarCheck, FaUserMd, FaHospital, FaClock, 
  FaTrashAlt, FaCalendarAlt, FaPlus, FaClipboardList,
  FaCheckCircle, FaTimesCircle, FaUserCircle, FaFileMedical, FaStar, FaRegStar
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const ViewBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";
  const API_URL = `${apiBase}/api/bookings`;

  const getAuthHeader = () => {
    return user && user.token ? { 'Authorization': `Bearer ${user.token}` } : {};
  };

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      console.log("DEBUG: Fetching patient dashboard for ID:", user.id);
      
      // Fetch Bookings
      const bookingRes = await fetch(`${API_URL}/${user.id}`, { headers: getAuthHeader() });
      console.log("DEBUG: Bookings response status:", bookingRes.status);
      
      if (bookingRes.ok) {
        if (bookingRes.status === 204) {
          console.log("DEBUG: No bookings found (204 Content)");
          setBookings([]);
        } else {
          const data = await bookingRes.json();
          console.log("DEBUG: Bookings found:", data.length);
          setBookings(data);
        }
      } else {
        const errorText = await bookingRes.text();
        console.error("DEBUG: Failed to fetch bookings:", bookingRes.status, errorText);
      }
      
      // Fetch Notifications
      const notifRes = await fetch(`${apiBase}/api/notifications/user/${user.id}`, { headers: getAuthHeader() });
      if (notifRes.ok && notifRes.status !== 204) {
        setNotifications(await notifRes.json());
      }
    } catch (err) {
      console.error('DEBUG: Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleMarkRead = async (id) => {
    try {
      await fetch(`${apiBase}/api/notifications/${id}/read`, { method: 'PATCH', headers: getAuthHeader() });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const [selectedBookingForFeedback, setSelectedBookingForFeedback] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingForFeedback) return;

    const feedbackData = {
      patientId: user.id,
      doctorId: selectedBookingForFeedback.doctorId || 1,
      doctorName: selectedBookingForFeedback.doctor,
      rating: feedbackRating,
      comment: feedbackComment
    };

    try {
      const res = await fetch(`${apiBase}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(feedbackData)
      });
      if (res.ok) {
        alert('Thank you for your feedback!');
        setNotifications(prev => [{
          id: Date.now(),
          message: `Your feedback for Dr. ${selectedBookingForFeedback.doctor} has been recorded.`,
          createdAt: new Date().toISOString(),
          read: false
        }, ...prev]);
        setSelectedBookingForFeedback(null);
        setFeedbackComment('');
        setFeedbackRating(5);
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const res = await fetch(`${API_URL}/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader() 
        }
      });

      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
        alert('Booking cancelled successfully.');
      } else {
        alert('Failed to cancel booking.');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Server error while cancelling booking.');
    }
  };

  // Filter bookings
  const upcomingBookings = bookings.filter(b => b.status === 'booked' || b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const stats = {
    upcoming: upcomingBookings.length,
    completed: bookings.filter(b => b.status === 'completed').length,
    total: bookings.length
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading your medical dashboard...</p>
        </div>
      </div>
    );
  }

  const renderBookingTable = (data) => {
    if (data.length === 0) {
      return (
        <div className={styles.noBookings}>
          <FaCalendarAlt size={40} />
          <p>No appointments found in this category.</p>
        </div>
      );
    }

    return (
      <div className={styles.tableWrapper}>
        <table className={styles.bookingTable}>
          <thead>
            <tr>
              <th><FaUserMd /> Doctor</th>
              <th><FaHospital /> Hospital</th>
              <th><FaCalendarAlt /> Date</th>
              <th><FaClock /> Time Slot</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(booking => (
              <React.Fragment key={booking.id}>
                <tr className={booking.status === 'cancelled' ? styles.cancelledRow : ''}>
                  <td className={styles.doctorCell}>
                    <div className={styles.docIcon}><FaUserMd /></div>
                    {booking.doctor}
                  </td>
                  <td>{booking.hospital}</td>
                  <td>{booking.date}</td>
                  <td>{booking.timeSlot}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[booking.status]}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'booked' ? (
                      <button className={styles.cancelBtn} onClick={() => handleCancelBooking(booking.id)}>
                        <FaTrashAlt /> Cancel
                      </button>
                    ) : booking.status === 'completed' ? (
                      <div className={styles.completedActions}>
                          <button className={styles.prescBtn} onClick={() => navigate('/my-prescriptions')}>
                            <FaFileMedical /> Prescription
                          </button>
                          <button className={styles.feedbackBtn} onClick={() => setSelectedBookingForFeedback(booking)}>
                            <FaStar /> Feedback
                          </button>
                      </div>
                    ) : (
                      <span className={styles.actionFixed}>-</span>
                    )}
                  </td>
                </tr>
                {selectedBookingForFeedback && selectedBookingForFeedback.id === booking.id && (
                  <tr className={styles.feedbackRow}>
                    <td colSpan="6">
                      <form onSubmit={handleFeedbackSubmit} className={styles.feedbackForm}>
                        <h4>Rate your experience with Dr. {booking.doctor}</h4>
                        <div className={styles.starRating}>
                          {[1, 2, 3, 4, 5].map(star => (
                             <button 
                               key={star} 
                               type="button" 
                               onClick={() => setFeedbackRating(star)}
                             >
                               {star <= feedbackRating ? <FaStar className={styles.starActive} /> : <FaRegStar />}
                             </button>
                          ))}
                        </div>
                        <textarea 
                          placeholder="Share your thoughts about the consultation..."
                          value={feedbackComment}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                          required
                        />
                        <div className={styles.formBtns}>
                          <button type="submit" className={styles.submitFeedbackBtn}>Submit Feedback</button>
                          <button type="button" className={styles.cancelFeedbackBtn} onClick={() => setSelectedBookingForFeedback(null)}>Cancel</button>
                        </div>
                      </form>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainLayout}>
        <div className={styles.mainContent}>
          <header className={styles.dashboardHeader}>
            <div className={styles.welcomeSection}>
              <div className={styles.userAvatar}>
                <FaUserCircle />
              </div>
              <div className={styles.welcomeText}>
                <h1>Health Portal, {user?.fullName || user?.username}</h1>
                <p>Track your medical journey and upcoming visits.</p>
              </div>
            </div>
            <button 
              className={styles.bookNewBtn} 
              onClick={() => navigate('/book-appointment')}
            >
              <FaPlus /> New Booking
            </button>
          </header>

          <section className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.blueCard}`}>
              <div className={styles.statIcon}><FaCalendarCheck /></div>
              <div className={styles.statInfo}>
                <h3>Upcoming</h3>
                <span className={styles.statNumber}>{stats.upcoming}</span>
              </div>
            </div>
            <div className={`${styles.statCard} ${styles.greenCard}`}>
              <div className={styles.statIcon}><FaCheckCircle /></div>
              <div className={styles.statInfo}>
                <h3>Completed</h3>
                <span className={styles.statNumber}>{stats.completed}</span>
              </div>
            </div>
          </section>

          <div className={styles.contentSection}>
            <div className={styles.tabHeader}>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'upcoming' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming Visits
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'history' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Medical History
              </button>
            </div>

            <div className={styles.tableCard}>
              {activeTab === 'upcoming' ? renderBookingTable(upcomingBookings) : renderBookingTable(pastBookings)}
            </div>
          </div>
        </div>

        {/* Sidebar for Notifications / Quick Actions */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h3><FaFileMedical /> Quick Actions</h3>
            <div className={styles.quickLinks}>
              <button onClick={() => navigate('/my-prescriptions')}>View Prescriptions</button>
              <button onClick={() => navigate('/user-profile')}>Update Profile</button>
            </div>
          </div>
          
          <div className={styles.sidebarCard}>
            <h3>Notifications</h3>
            <div className={styles.notificationList}>
              {notifications.length > 0 ? notifications.slice(0, 5).map(n => (
                <div key={n.id} className={`${styles.notifItem} ${!n.read ? styles.unread : ''}`} onClick={() => !n.read && handleMarkRead(n.id)}>
                  <p>{n.message}</p>
                  <span>{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              )) : (
                <p className={styles.noNotif}>No new notifications.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ViewBooking;