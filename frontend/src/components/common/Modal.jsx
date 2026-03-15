import React from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from './Modal.module.css';

/**
 * A reusable modal component for displaying forms or alerts over the main content.
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to render inside the modal.
 * @param {function} props.onClose - Function called when closing the modal.
 * @param {string} [props.title] - Optional modal title.
 * @param {React.ReactNode} [props.footer] - Optional footer buttons or actions.
 */
const Modal = ({ children, onClose, title, footer }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <FaTimes />
        </button>
        {title && <h2 className={styles.modalTitle}>{title}</h2>}
        <div className={styles.modalBody}>{children}</div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
