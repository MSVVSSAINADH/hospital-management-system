import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import styles from './TestimonialSection.module.css';

export function TestimonialSection() {
  return (
    <section className={styles.testimonialSection}>
      <div className={styles.testimonialContent}>
        <FaQuoteLeft className={styles.quoteIcon} />
        <p className={styles.testimonialText}>
          "Healthcare is built on trust, compassion, and efficiency. Every service provided with care ensures the well-being of patients. A well-organized system supports doctors, staff, and families, creating harmony in treatment and management. Strong coordination ensures that every patient receives timely support and quality care."
        </p>
        <div className={styles.divider} />
        <p className={styles.authorName}>John Doe</p>
      </div>
    </section>
  );
}