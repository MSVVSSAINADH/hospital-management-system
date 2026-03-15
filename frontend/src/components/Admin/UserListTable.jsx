// src/pages/Admin/UserListTable.jsx

import React from 'react';
import styles from './AdminDashboard.module.css'; // Use the same CSS module
import { FaTrashAlt } from 'react-icons/fa';

const UserListTable = ({ users, onDeleteUser }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Zone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className={styles.userPhoto}>
                  {user.profilePhoto ? (
                    <img src={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5101"}/upload/${user.profilePhoto}`} alt={user.username} />
                  ) : (
                    <div className={styles.placeholder}>👤</div>
                  )}
                </div>
              </td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>{user.zone}</td>
              <td>
                <button
                  onClick={() => onDeleteUser(user.id)}
                  className={styles.deleteBtn}
                >
                  <FaTrashAlt /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListTable;