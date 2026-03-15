import React, { useState, useEffect, useContext } from 'react';
import styles from './AdminBroadcast.module.css';
import { FaBullhorn, FaHistory, FaCheckCircle, FaTrash, FaExclamationTriangle, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { announcementApi } from '../../api';

const AdminBroadcast = () => {
    const { user } = useContext(AuthContext);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'info'
    });

    const fetchAnnouncements = async () => {
        try {
            const res = await announcementApi.getActive();
            setAnnouncements(res.data);
        } catch (err) {
            console.error("Error fetching broadcasts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await announcementApi.create(formData);
            alert('Broadcast sent successfully!');
            setFormData({ title: '', content: '', type: 'info' });
            await fetchAnnouncements();
        } catch (err) {
            console.error("Broadcast failed", err);
            const msg = err.response?.data?.message || err.message;
            alert(`Broadcast Failed: ${msg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const deactivate = async (id) => {
        try {
            await announcementApi.deactivate(id);
            await fetchAnnouncements();
        } catch (err) {
            console.error("Error deactivating", err);
        }
    };

    if (loading) return <div className={styles.loading}>Opening Signal Channel...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1><FaBullhorn /> Hospital Broadcast System</h1>
                <p>Send emergency alerts or general announcements to all patients and staff.</p>
            </header>

            <div className={styles.layout}>
                <div className={styles.formPanel}>
                    <form onSubmit={handleSubmit} className={styles.broadcastForm}>
                        <h2>Create New Broadcast</h2>
                        <div className={styles.fg}>
                            <label>Title</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Free Vaccination Drive"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </div>
                        <div className={styles.fg}>
                            <label>Alert Level</label>
                            <select 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="info">General Information</option>
                                <option value="warning">Important Update</option>
                                <option value="emergency">Emergency Alert</option>
                            </select>
                        </div>
                        <div className={styles.fg}>
                            <label>Message Content</label>
                            <textarea 
                                placeholder="Write the details for the public banner..."
                                value={formData.content}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                required
                            />
                        </div>
                        <button type="submit" disabled={submitting}>
                            {submitting ? <FaSpinner className={styles.spinner} /> : <><FaBullhorn /> Send Broadcast</>}
                        </button>
                    </form>
                </div>

                <div className={styles.historyPanel}>
                    <h2><FaHistory /> Active Announcements</h2>
                    <div className={styles.annList}>
                        {announcements.length > 0 ? announcements.map(ann => (
                            <div key={ann.id} className={`${styles.annCard} ${styles[ann.type]}`}>
                                <div className={styles.annHeader}>
                                    <div>
                                        {ann.type === 'emergency' && <FaExclamationTriangle />}
                                        {ann.type === 'info' && <FaInfoCircle />}
                                        <strong>{ann.title}</strong>
                                        <span className={ann.active ? styles.activeBadge : styles.inactiveBadge}>
                                            {ann.active ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                    </div>
                                    {ann.active && (
                                        <button onClick={() => deactivate(ann.id)} title="Remove Announcement"><FaTrash /></button>
                                    )}
                                </div>
                                <p>{ann.content}</p>
                                <span className={styles.annDate}>{new Date(ann.createdAt).toLocaleString()}</span>
                            </div>
                        )) : <p className={styles.empty}>No active announcements currently displaying on the homepage.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBroadcast;
