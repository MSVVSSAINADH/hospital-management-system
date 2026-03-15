import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import styles from './WelcomeSection.module.css';

export function WelcomeSection() {
  return (
    <section className={styles.welcomeSection}>
      <div className={styles.contentWrapper}>
        <div className={styles.imageColumn}>
          <img
            loading="lazy"
            src="/welcome_team.png"
            alt="Smiling male and female doctors"
            className={styles.welcomeImage}
          />
        </div>
        <div className={styles.textColumn}>
          <h3 className={styles.subtitle}>Welcome to KL Hospital</h3>
          <h1 className={styles.title}>
            Best Care for Your
            <br />
            Good Health
          </h1>
          <p className={styles.description}>
            "Life is full of challenges, yet with determination we can overcome them. Success comes from consistent effort and the courage to move forward. Growth happens when we learn from experience and embrace opportunities. Strength is built when we face difficulties with confidence and positivity."
          </p>
          <div className={styles.featuresGrid}>
            <div className={styles.featuresColumn}>
              <FeatureItem text="A Passion for Healing" />
              <FeatureItem text="All our best" />
              <FeatureItem text="Always Caring" />
            </div>
            <div className={styles.featuresColumn}>
              <FeatureItem text="5-Star Care" />
              <FeatureItem text="Believe in Us" />
              <FeatureItem text="A Legacy of Excellence" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ text }) {
  return (
    <div className={styles.featureItem}>
      <FaCheckCircle className={styles.featureIcon} />
      <span className={styles.featureText}>{text}</span>
    </div>
  );
}