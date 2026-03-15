import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import styles from './ContactPage.module.css';

// Corrected import paths
import { ContactInfo } from '../components/Contacts/ContactInfo';
import { ContactForm } from '../components/Contacts/ContactForm';

const ContactPage = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, 'YOUR_PUBLIC_KEY')
      .then((result) => {
          console.log('Message sent successfully:', result.text);
          alert('✅ Your message has been sent successfully!');
          form.current.reset();
      }, (error) => {
          console.error('Failed to send message:', error.text);
          alert('❌ Failed to send message. Please try again later.');
      });
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.intro}>
          We are here to assist you. Feel free to reach out to us through any of the following methods.
        </p>
      </div>

      <div className={styles.contactContainer}>
        <div className={styles.contactInfoWrapper}>
          <ContactInfo />
        </div>
        <div className={styles.contactFormWrapper}>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;