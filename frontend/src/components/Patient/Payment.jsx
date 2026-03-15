import React, { useState } from 'react';
import styles from './Payment.module.css';
import { FaUser, FaCreditCard, FaLock, FaCalendarAlt } from 'react-icons/fa';

const Payment = () => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to process the payment
    console.log('Payment data submitted:', paymentData);
    alert('Payment successful!');
    setPaymentData({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}><FaCreditCard /> Payment Information</h1>
        <p className={styles.subtitle}>Securely enter your card details to complete your payment.</p>
      </header>
      <div className={styles.paymentCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Card Number</label>
            <FaCreditCard className={styles.inputIcon} />
            <input
              type="text"
              name="cardNumber"
              placeholder="e.g., 1234 5678 9012 3456"
              value={paymentData.cardNumber}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Card Holder Name</label>
            <FaUser className={styles.inputIcon} />
            <input
              type="text"
              name="cardName"
              placeholder="Full Name"
              value={paymentData.cardName}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Expiry Date</label>
              <FaCalendarAlt className={styles.inputIcon} />
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>CVV</label>
              <FaLock className={styles.inputIcon} />
              <input
                type="text"
                name="cvv"
                placeholder="e.g., 123"
                value={paymentData.cvv}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
          </div>
          <button type="submit" className={styles.submitBtn}>
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;