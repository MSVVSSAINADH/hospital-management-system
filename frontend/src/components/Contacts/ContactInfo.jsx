import React from 'react';
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import styles from './ContactInfo.module.css';

export const ContactInfo = () => {
  const Card = ({ title, items, icon: Icon, type }) => (
    <div className={`${styles.infoCard} ${styles[type]}`}>
      <div className={styles.iconContainer}>
        <Icon className={styles.cardIcon} />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {items.map((item, index) => (
          <p key={index} className={styles.cardText}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.infoContainer}>
      <Card
        type="emergency"
        title="Emergency"
        items={["(+91) 108"]}
        icon={FaPhoneAlt}
      />
      <Card
        type="location"
        title="Location"
        items={["Vaddeswaram", "Andhra Pradesh"]}
        icon={FaMapMarkerAlt}
      />
      <Card
        type="email"
        title="Email"
        items={["support@klhospitals.in"]}
        icon={FaEnvelope}
      />
      <Card
        type="hours"
        title="Working Hours"
        items={["Mon-Sat 10:00 AM - 10:00 PM", "Sunday Emergency only"]}
        icon={FaClock}
      />
    </div>
  );
};