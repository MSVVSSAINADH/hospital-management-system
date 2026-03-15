import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css'; // Use CSS Modules
import UserListTable from './UserListTable'; // New component for user table
import { FaUserShield, FaUsers } from 'react-icons/fa'; // Import icons from react-icons
import { userApi } from '../../api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUsers, setShowUsers] = useState(false);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        setUsers(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Could not load user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []); // Empty dependency array means this runs once on mount

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.deleteUser(userId);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user.');
      }
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Welcome! Manage users and platform data here.</p>
      </header>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <FaUsers className={styles.metricIcon} />
          <h3 className={styles.metricValue}>{users.length}</h3>
          <p className={styles.metricLabel}>Total Users</p>
        </div>
        {/* You can add more metric cards here for doctors, appointments, etc. */}
      </div>

      <section className={styles.mainSection}>
        <div className={styles.actionHeader}>
          <h2><FaUsers /> Registered Users</h2>
          <button className={styles.toggleBtn} onClick={() => setShowUsers(!showUsers)}>
            {showUsers ? 'Hide Users' : 'View All Users'}
          </button>
        </div>
        
        {loading && <p className={styles.loading}>Loading users...</p>}
        {error && <p className={styles.error}>{error}</p>}
        
        {showUsers && !loading && !error && (
          <UserListTable users={users} onDeleteUser={handleDeleteUser} />
        )}

        {!showUsers && !loading && !error && (
          <p className={styles.toggleMessage}>Click the button above to view all registered users.</p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;