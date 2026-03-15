import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import styles from './DoctorCard.module.css';
import { Link } from 'react-router-dom';

export function DoctorCard({ image, name, specialty }) {
  return (
    <article className={styles.doctorCard}>
      <img loading="lazy" src={image} alt={`Dr. ${name}`} className={styles.doctorImage} />
      <div className={styles.infoSection}>
        <div className={styles.infoContent}>
          <h3 className={styles.doctorName}>{name}</h3>
          <p className={styles.doctorSpecialty}>{specialty}</p>
        </div>
      </div>
      <Link to={`/doctors/${name.replace(/\s+/g, '-').toLowerCase()}`} className={styles.profileLink}>
        <span className={styles.linkText}>View Profile</span>
      </Link>
    </article>
  );
}