import React from 'react';
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import styles from './ContactCard.module.css';

export function ContactCard({ type, title, items }) {
  const getIcon = (cardType) => {
    switch (cardType) {
      case 'emergency': return <FaPhoneAlt className={styles.icon} />;
      case 'location': return <FaMapMarkerAlt className={styles.icon} />;
      case 'email': return <FaEnvelope className={styles.icon} />;
      case 'hours': return <FaClock className={styles.icon} />;
      default: return null;
    }
  };

  return (
    <div className={`${styles.contactCard} ${styles[type]}`}>
      <div className={styles.iconContainer}>
        {getIcon(type)}
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      {items.map((item, index) => (
        <p key={index} className={styles.cardText}>
          {type === 'email' ? <a href={`mailto:${item}`}>{item}</a> : item}
        </p>
      ))}
    </div>
  );
}