import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaUserShield, 
  FaUserMd, 
  FaStethoscope, 
  FaHospital,
  FaHospitalUser, 
  FaCalendarCheck, 
  FaPlus,
  FaFlask,
  FaInbox,
  FaChartLine,
  FaQuoteLeft,
  FaBullhorn
} from 'react-icons/fa';
import styles from './AdminSidebar.module.css';

const AdminSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>Admin Panel</h2>
      </div>
      <nav className={styles.sidebarNav}>
        <NavLink 
          to="/admin/dashboard" 
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <FaUserShield className={styles.icon} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/manage-doctors"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <FaUserMd className={styles.icon} />
          <span>Manage Doctors</span>
        </NavLink>

        <NavLink
          to="/admin/manage-staff"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <FaStethoscope className={styles.icon} />
          <span>Manage Staff</span>
        </NavLink>

        <NavLink
          to="/admin/departments"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <FaHospital className={styles.icon} />
          <span>Departments</span>
        </NavLink>

        <NavLink
          to="/admin/allocate-resources"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <FaHospitalUser className={styles.icon} />
          <span>Resources</span>
        </NavLink>

        <NavLink
          to="/admin/view-appointments"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <FaCalendarCheck className={styles.icon} />
          <span>Appointments</span>
        </NavLink>

        <NavLink
          to="/admin/lab-center"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <FaFlask className={styles.icon} />
          <span>Lab Fulfillment</span>
        </NavLink>

        <NavLink
          to="/admin/enquiries"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <FaInbox className={styles.icon} />
          <span>Public Enquiries</span>
        </NavLink>

        <NavLink
          to="/admin/finance"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <FaChartLine className={styles.icon} />
          <span>Finance Hub</span>
        </NavLink>

        <NavLink
          to="/admin/feedback"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <FaQuoteLeft className={styles.icon} />
          <span>Feedback Hub</span>
        </NavLink>

        <NavLink
          to="/admin/broadcast"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <FaBullhorn className={styles.icon} />
          <span>Broadcasts</span>
        </NavLink>

        <NavLink
          to="/admin/manage-availability"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <FaPlus className={styles.icon} />
          <span>Schedules</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
