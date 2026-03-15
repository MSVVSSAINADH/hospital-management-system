import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  return (
    <div className={styles.layoutContainer}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
