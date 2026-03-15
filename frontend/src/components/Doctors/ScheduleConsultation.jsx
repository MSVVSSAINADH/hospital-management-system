import React, { useState, useContext } from 'react';
import styles from './ScheduleConsultation.module.css';
import { FaCalendarPlus, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ScheduleConsultation = () => {
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState('');
  const [blockedTimes, setBlockedTimes] = useState([]);
  
  const timeSlots = [
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '05:00 PM - 07:00 PM',
    '07:00 PM - 09:00 PM',
    '09:00 PM - 10:00 PM',
  ];

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setBlockedTimes([]); // reset on date change
  };

  const toggleTimeSlot = (slot) => {
    setBlockedTimes(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || blockedTimes.length === 0) {
      alert('Please select a date and at least one time slot.');
      return;
    }

    const scheduleData = {
      doctorName: user?.name,
      doctorUsername: user?.username, // Better for uniqueness
      date: selectedDate,
      blockedSlots: blockedTimes
    };

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";
      const response = await axios.post(
        `${apiBase}/api/doctor-schedule/save`,
        scheduleData,
        {
          headers: { 'Authorization': `Bearer ${user?.token}` }
        }
      );
      console.log('Schedule saved:', response.data);
      alert(`Successfully blocked ${blockedTimes.length} slots on ${selectedDate}.`);

      setSelectedDate('');
      setBlockedTimes([]);
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <FaCalendarPlus /> Schedule Consultation
        </h1>
        <p className={styles.subtitle}>
          Welcome, Dr. {user?.name}. Manage your consultation hours by blocking unavailable slots.
        </p>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Set Your Availability</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Select Date</label>
              <input
                type="date"
                className={styles.input}
                value={selectedDate}
                onChange={handleDateChange}
                required
              />
            </div>

            {selectedDate && (
              <div className={styles.timeSlotsGrid}>
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`${styles.slotBtn} ${
                      blockedTimes.includes(slot) ? styles.blocked : styles.available
                    }`}
                    onClick={() => toggleTimeSlot(slot)}
                  >
                    <FaClock className={styles.slotIcon} /> {slot}
                  </button>
                ))}
              </div>
            )}

            <div className={styles.actionButtons}>
               <button 
                  type="button" 
                  className={styles.leaveBtn}
                  onClick={() => setBlockedTimes(timeSlots)}
               >
                 Mark Entire Day as Leave
               </button>
               <button type="submit" className={styles.submitBtn}>
                 Save Schedule
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleConsultation;
