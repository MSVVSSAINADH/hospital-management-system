import React, { useState, useContext, useEffect } from 'react';
import styles from './BookAppointment.module.css';
import { FaCalendarPlus, FaUserMd, FaClock, FaComment, FaArrowLeft, FaFilter } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookAppointment = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    doctor: '',
    doctorId: '',
    date: '',
    timeSlot: '',
    description: '',
  });

  const [doctors, setDoctors] = useState([]);
  const [groupedDoctors, setGroupedDoctors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Standard time slots defined by the hospital
  const standardTimeSlots = [
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '05:00 PM - 07:00 PM',
    '07:00 PM - 09:00 PM',
    '09:00 PM - 10:00 PM',
  ];

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8086';

  // Fetch all doctors and group them by specialization
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/doctors`);
        const docs = res.data || [];
        setDoctors(docs);

        const grouped = docs.reduce((acc, doc) => {
          const spec = doc.specialization || 'General';
          if (!acc[spec]) acc[spec] = [];
          acc[spec].push(doc);
          return acc;
        }, {});
        setGroupedDoctors(grouped);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };
    fetchDoctors();
  }, [apiBase]);

  // Handle slot filtering when doctor or date changes
  useEffect(() => {
    const calculateAvailableSlots = async () => {
      console.log("DEBUG: Calculating slots for Doctor ID:", formData.doctorId, "Date:", formData.date);
      if (formData.doctorId && formData.date && user?.token) {
        setLoadingSlots(true);
        try {
          const config = {
            headers: { 'Authorization': `Bearer ${user.token}` }
          };

          // 1. Fetch blocked slots from admin (DoctorAvailability)
          console.log("DEBUG: Fetching blocked slots (Admin)...");
          const blockedRes = await axios.get(`${apiBase}/api/availability/blocked?doctorId=${formData.doctorId}&date=${formData.date}`, config);
          const adminBlockedTimes = (blockedRes.data || []).map(b => b.timeSlot);
          console.log("DEBUG: Admin Blocked Times:", adminBlockedTimes);

          // 2. Fetch blocked slots from doctor (DoctorSchedule)
          console.log("DEBUG: Fetching blocked slots (Doctor)...");
          let doctorBlockedTimes = [];
          try {
            const scheduleRes = await axios.get(`${apiBase}/api/doctor-schedule/${formData.doctor}/${formData.date}`, config);
            if (scheduleRes.data && scheduleRes.data.blockedSlots) {
              doctorBlockedTimes = scheduleRes.data.blockedSlots;
            }
          } catch (err) {
            console.log("DEBUG: No doctor-level schedule found or error:", err.message);
          }
          console.log("DEBUG: Doctor Blocked Times:", doctorBlockedTimes);

          // 3. Fetch already booked appointments for this doctor and date
          console.log("DEBUG: Fetching booked appointments...");
          const bookingsRes = await axios.get(`${apiBase}/api/bookings/by-doctor/${formData.doctorId}`, config);
          const bookedTimesForDate = (bookingsRes.data || [])
            .filter(b => b.date === formData.date && b.status !== 'cancelled')
            .map(b => b.timeSlot);
          console.log("DEBUG: Already Booked Times:", bookedTimesForDate);

          // 4. Filter standard slots
          const allBlocked = [...new Set([...adminBlockedTimes, ...doctorBlockedTimes, ...bookedTimesForDate])];
          const filtered = standardTimeSlots.filter(slot => !allBlocked.includes(slot));
          console.log("DEBUG: Final Available Slots:", filtered);

          setAvailableSlots(filtered);
        } catch (err) {
          console.error('DEBUG: Slot calculation error:', err.response?.status, err.response?.data || err.message);
          setAvailableSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      } else {
        console.log("DEBUG: Missing doctorId, date, or token. Skipping slot calculation.");
        setAvailableSlots([]);
      }
    };
    calculateAvailableSlots();
  }, [formData.doctorId, formData.date, formData.doctor, user?.token, apiBase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'doctor') {
      const doc = doctors.find(d => d.name === value);
      setFormData({ ...formData, doctor: value, doctorId: doc ? doc.id : '', timeSlot: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!formData.doctorId) {
      alert('Error: Selected doctor has no unique ID. Please contact support.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        userId: user.id,
        hospital: 'City General Hospital', // Default hospital system name
        doctor: formData.doctor,
        doctorId: formData.doctorId,
        patientName: user.fullName || user.username,
        date: formData.date,
        timeSlot: formData.timeSlot,
        description: formData.description,
        status: 'booked'
      };

      await axios.post(`${apiBase}/api/bookings`, payload, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      alert('Success! Your appointment has been scheduled.');
      navigate('/view-booking');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('We encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <FaArrowLeft /> Back
        </button>
        <h1 className={styles.title}><FaCalendarPlus /> Schedule Appointment</h1>
        <p className={styles.subtitle}>Select a department and doctor to secure your consultation time.</p>
      </header>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.bookingForm}>
          
          <div className={styles.formGrid}>
            <div className={styles.inputSection}>
              <label className={styles.label}><FaFilter className={styles.labelIcon} /> Specialization / Doctor</label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="">Choose a doctor</option>
                {Object.keys(groupedDoctors).map(spec => (
                  <optgroup key={spec} label={spec}>
                    {groupedDoctors[spec].map(doc => (
                      <option key={doc.id} value={doc.name}>
                        {doc.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className={styles.inputSection}>
              <label className={styles.label}><FaCalendarPlus className={styles.labelIcon} /> Preferred Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={styles.input}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className={styles.inputSection}>
                <label className={styles.label}><FaClock className={styles.labelIcon} /> Available Time Slots</label>
                <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    className={styles.select}
                    required
                    disabled={!formData.doctorId || !formData.date || loadingSlots}
                >
                    <option value="">
                        {!formData.doctorId || !formData.date ? 'Select doctor & date' : 
                         loadingSlots ? 'Checking availability...' : 
                         availableSlots.length > 0 ? 'Select a time' : 'No slots available (Fully booked/Off)'}
                    </option>
                    {availableSlots.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                </select>
            </div>
          </div>

          <div className={styles.inputSection}>
            <label className={styles.label}><FaComment className={styles.labelIcon} /> Description / Notes</label>
            <textarea
              name="description"
              placeholder="Tell us briefly about your visit..."
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              required
            />
          </div>

          <button type="submit" disabled={loading || !formData.timeSlot} className={styles.submitBtn}>
            {loading ? 'Securing your slot...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
