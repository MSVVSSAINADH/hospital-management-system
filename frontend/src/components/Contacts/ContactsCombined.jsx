import React from 'react';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';
import styles from './ContactsCombined.module.css';

export const ContactsCombined = () => {
  return (
    <div className={styles.contactPage}>
      <h1 className={styles.pageTitle}>Contact Us</h1>
      <p className={styles.pageSubtitle}>Feel free to reach out to us with any questions.</p>
      <div className={styles.contentGrid}>
        <div className={styles.infoColumn}>
          <ContactInfo />
        </div>
        <div className={styles.formColumn}>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};