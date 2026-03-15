import React from "react";
import styles from "./AboutPage.module.css";
import { TestimonialSection } from '../components/AboutUs/TestimonialSection';

export default function AboutPage() {
  return (
    <main className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.aboutHero}>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>About Our Hospital</h1>
          <p className={styles.heroSubtitle}>
            Dedicated to providing trusted healthcare services with compassion and innovation.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className={styles.missionSection} style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--primary-color)', fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'Yeseva One, serif' }}>Our Mission & Vision</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          Our mission is to improve the health and well-being of the communities we serve by providing high-quality, compassionate, and innovative healthcare. We are committed to clinical excellence, patient-centered care, and continuous improvement in all that we do.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8' }}>
          We envision a future where everyone has access to exceptional medical care. Through state-of-the-art technology, a dedicated team of medical professionals, and a culture of empathy, we strive to be the most trusted healthcare provider in the region.
        </p>
      </section>

      {/* Testimonial Section */}
      <section className={styles.fullWidthSection}>
        <TestimonialSection />
      </section>
    </main>
  );
}