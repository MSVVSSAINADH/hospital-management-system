import React, { useContext, useState, useEffect } from 'react';
import styles from './UserProfile.module.css';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaLock } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { userApi } from "../../api";


const UserProfile = () => {
  const { user, login } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    address: '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        mobile: user.mobile || '',
        address: user.address || '',
        currentPassword: '',
        newPassword: '',
      });
      setHasChanges(false);
    }
  }, [user]);

  if (!user) return <p className={styles.container}>No user logged in.</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Check if anything changed compared to original user data
      const changed =
        updated.username !== user.username ||
        updated.email !== user.email ||
        updated.mobile !== (user.mobile || '') ||
        updated.address !== (user.address || '') ||
        updated.newPassword !== '' ||
        updated.currentPassword !== '';

      setHasChanges(changed);
      return updated;
    });
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
        currentPassword: formData.currentPassword || undefined,
        password: formData.newPassword || undefined,
      };

      const response = await userApi.updateUser(user.id, updateData);

      // ✅ Merge existing token so the user stays logged in
      const updatedUserWithToken = { ...response.data, token: user.token };
      login(updatedUserWithToken); 
      setIsEditing(false);
      setFormData({ ...formData, currentPassword: '', newPassword: '' });
      setHasChanges(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <img
            src={user.profilePhoto || 'https://cdn.builder.io/api/v1/image/assets/default-profile.png'}
            alt="User Profile"
            className={styles.profilePic}
          />
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={styles.editInput}
            />
          ) : (
            <h1 className={styles.userName}>{user.username}</h1>
          )}
        </div>

        <div className={styles.profileDetails}>
          <div className={styles.detailItem}>
            <FaEnvelope className={styles.detailIcon} />
            {isEditing ? (
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.editInput} />
            ) : (
              <span className={styles.detailText}>{user.email}</span>
            )}
          </div>

          <div className={styles.detailItem}>
            <FaPhone className={styles.detailIcon} />
            {isEditing ? (
              <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className={styles.editInput} />
            ) : (
              <span className={styles.detailText}>{user.mobile || 'N/A'}</span>
            )}
          </div>

          <div className={styles.detailItem}>
            <FaMapMarkerAlt className={styles.detailIcon} />
            {isEditing ? (
              <input type="text" name="address" value={formData.address} onChange={handleChange} className={styles.editInput} />
            ) : (
              <span className={styles.detailText}>{user.address || 'N/A'}</span>
            )}
          </div>

          <div className={styles.detailItem}>
            <FaCalendarAlt className={styles.detailIcon} />
            <span className={styles.detailText}>
              Last Login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
            </span>
          </div>

          {isEditing && (
            <>
              <div className={styles.detailItem}>
                <FaLock className={styles.detailIcon} />
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={styles.editInput}
                />
              </div>
              <div className={styles.detailItem}>
                <FaLock className={styles.detailIcon} />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={styles.editInput}
                />
              </div>
            </>
          )}
        </div>

        {isEditing ? (
          <div className={styles.editButtons}>
            <button className={styles.saveBtn} onClick={handleSave} disabled={!hasChanges}>
              <FaSave /> Save
            </button>
            <button className={styles.cancelBtn} onClick={handleEditToggle}>
              <FaTimes /> Cancel
            </button>
          </div>
        ) : (
          <button className={styles.editBtn} onClick={handleEditToggle}>
            <FaEdit /> Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
