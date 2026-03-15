import React from 'react';
import { FaHeart, FaHospital } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          &copy; {currentYear} KL Hospital Management System. All Rights Reserved.
        </p>
        <p className={styles.tagline}>
          Made with <FaHeart className={styles.heartIcon} /> for a healthier community.
        </p>
      </div>
    </footer>
  );
};

export default Footer;