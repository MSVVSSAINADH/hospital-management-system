import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPen, FaPaperPlane } from 'react-icons/fa';
import styles from './ContactForm.module.css';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";
      const res = await fetch(`${apiBase}/api/contact-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Thank you for your message! We will get back to you shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('Something went wrong. Please try again later.');
      }
    } catch (err) {
      console.error("Contact form error:", err);
      alert('Network error. Pulse try again.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.highlightText}>Get in touch</h3>
      <h2 className={styles.sectionTitle}>Contact Us</h2>
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.inputIcon} />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.formInput} ${styles.nameInput}`}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.inputIcon} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.formInput} ${styles.emailInput}`}
              required
            />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className={styles.formInput}
            style={{ paddingLeft: '1rem' }}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <textarea
            name="message"
            placeholder="Your message"
            value={formData.message}
            onChange={handleChange}
            className={`${styles.formInput} ${styles.messageInput}`}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          <FaPaperPlane className={styles.buttonIcon} /> Submit
        </button>
      </form>
    </div>
  );
};