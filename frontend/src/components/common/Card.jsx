import React from 'react';
import styles from './Card.module.css';

/**
 * A reusable container component for grouping content with a clean, modern card aesthetic.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be displayed inside the card.
 */
const Card = ({ children }) => {
  return (
    <div className={styles.card}>
      {children}
    </div>
  );
};

export default Card;
