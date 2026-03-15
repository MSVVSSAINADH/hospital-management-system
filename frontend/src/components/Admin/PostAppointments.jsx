import React, { useState } from 'react';
import styles from './PostAppointments.module.css';
import { FaCalendarPlus, FaHospital, FaUserMd, FaClock, FaCommentDots, FaFileUpload } from 'react-icons/fa';

const PostAppointments = () => {
  const [appointmentData, setAppointmentData] = useState({
    hospital: '',
    doctor: '',
    date: '',
    timeSlot: '',
    description: '',
    image: null,
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Example time slots - This would ideally come from an API
  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
  ];

  const fetchAvailableTimeSlots = (doctor, date) => {
    // Simulating an API call with a delay
    setLoadingSlots(true);
    return new Promise(resolve => {
      setTimeout(() => {
        const existingAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const bookedSlots = existingAppointments
          .filter(appointment => appointment.doctor === doctor && appointment.date === date)
          .map(appointment => appointment.timeSlot);
        const available = timeSlots.filter(slot => !bookedSlots.includes(slot));
        setLoadingSlots(false);
        resolve(available);
      }, 500);
    });
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setAppointmentData({ ...appointmentData, [name]: value });

    if (name === 'doctor' || name === 'date') {
      const { doctor, date } = { ...appointmentData, [name]: value };
      if (doctor && date) {
        const slots = await fetchAvailableTimeSlots(doctor, date);
        setAvailableTimeSlots(slots);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAppointmentData({ ...appointmentData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAppointment = {
      ...appointmentData,
      id: Date.now(), // Add a unique ID
    };

    const existingAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const updatedAppointments = [...existingAppointments, newAppointment];
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    alert('Appointment posted successfully!');
    setAppointmentData({
      hospital: '',
      doctor: '',
      date: '',
      timeSlot: '',
      description: '',
      image: null,
    });
    setAvailableTimeSlots([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}><FaCalendarPlus /> Post New Appointment</h1>
        <p className={styles.subtitle}>Fill in the details to post an available appointment slot for patients.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}><FaHospital className={styles.icon} /> Hospital</label>
            <input
              type="text"
              name="hospital"
              value={appointmentData.hospital}
              onChange={handleChange}
              required
              placeholder="e.g., City General Hospital"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}><FaUserMd className={styles.icon} /> Doctor</label>
            <input
              type="text"
              name="doctor"
              value={appointmentData.doctor}
              onChange={handleChange}
              required
              placeholder="e.g., Dr. Jane Doe"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}><FaClock className={styles.icon} /> Date & Time Slot</label>
            <input
              type="date"
              name="date"
              value={appointmentData.date}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          {loadingSlots && <p className={styles.loadingMessage}>Checking for available slots...</p>}
          {!loadingSlots && appointmentData.doctor && appointmentData.date && (
            availableTimeSlots.length > 0 ? (
              <div className={styles.statusBoxSuccess}>
                <p><strong>{availableTimeSlots.length}</strong> time slots are available.</p>
                <label className={styles.label}>Select a slot:</label>
                <select
                  name="timeSlot"
                  value={appointmentData.timeSlot}
                  onChange={handleChange}
                  required
                  className={styles.input}
                >
                  <option value="">-- Select a Time Slot --</option>
                  {availableTimeSlots.map((slot, index) => (
                    <option key={index} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            ) : (
              <p className={styles.statusBoxError}>No time slots available for this doctor and date.</p>
            )
          )}
          
          <div className={styles.formGroup}>
            <label className={styles.label}><FaCommentDots className={styles.icon} /> Description</label>
            <textarea
              name="description"
              value={appointmentData.description}
              onChange={handleChange}
              required
              placeholder="e.g., Routine check-up, new patient consultation"
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}><FaFileUpload className={styles.icon} /> Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Post Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostAppointments;