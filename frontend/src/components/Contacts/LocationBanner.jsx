import React from 'react';
import styles from './LocationBanner.module.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

export const LocationBanner = () => {
  return (
    <section className={styles.locationSection}>
      <h2 className={styles.title}>Find Us Easily</h2>
      <p className={styles.subtitle}>Click the map to view our location on Google Maps.</p>
      
      <div className={styles.mapContainer}>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15234.331575855013!2d78.43572834057883!3d17.336181665403063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcba23aab508ad9%3A0xc9940ce579469146!2sOwaisi%20Hospital%20%26%20Research%20Centre!5e0!3m2!1sen!2sus!4v1709664585149!5m2!1sen!2sus" 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Hospital Location Map"
          className={styles.mapIframe}
        ></iframe>
      </div>
    </section>
  );
};