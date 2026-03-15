import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserShield, FaStethoscope, FaUser, FaAngleRight } from 'react-icons/fa';
import styles from './SideBar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>Dashboard</h3>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <Link to="/patient/dashboard" className={styles.menuLink}>
            <FaUser className={styles.icon} />
            <span className={styles.linkText}>Patient Panel</span>
            <FaAngleRight className={styles.arrowIcon} />
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/doctor/dashboard" className={styles.menuLink}>
            <FaStethoscope className={styles.icon} />
            <span className={styles.linkText}>Doctor Panel</span>
            <FaAngleRight className={styles.arrowIcon} />
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/admin/dashboard" className={styles.menuLink}>
            <FaUserShield className={styles.icon} />
            <span className={styles.linkText}>Admin Panel</span>
            <FaAngleRight className={styles.arrowIcon} />
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;