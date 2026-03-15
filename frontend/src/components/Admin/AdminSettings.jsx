import React, { useState, useEffect, useContext } from 'react';
import styles from './AdminSettings.module.css';
import { FaCog, FaSave, FaCheckCircle, FaSpinner, FaHospital, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { systemConfigApi } from '../../api';

const AdminSettings = () => {
    const { user } = useContext(AuthContext);
    const [config, setConfig] = useState([]);
    const [newSettings, setNewSettings] = useState({
        hospitalName: '',
        contactEmail: '',
        contactPhone: '',
        hospitalAddress: '',
        websiteUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await systemConfigApi.getAll();
                const settingsMap = {};
                res.data.forEach(item => settingsMap[item.configKey] = item.configValue);
                setNewSettings(prev => ({ ...prev, ...settingsMap }));
            } catch (err) {
                console.error("Config fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleAllSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const promises = Object.keys(newSettings).map(key => 
                systemConfigApi.update({ configKey: key, configValue: newSettings[key] })
            );
            await Promise.all(promises);
            alert('Global System Settings updated successfully!');
        } catch (err) {
            console.error("Global save failed", err);
            alert("Failed to save some settings. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className={styles.loading}>Accessing Core System Settings...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1><FaCog /> System Configuration</h1>
                <p>Manage global hospital variables, contact information, and branding defaults.</p>
            </header>

            <form onSubmit={handleAllSave} className={styles.settingsForm}>
                <div className={styles.section}>
                    <h2><FaHospital /> General Branding</h2>
                    <div className={styles.grid}>
                        <div className={styles.fg}>
                            <label>Hospital Public Name</label>
                            <input 
                                type="text" 
                                value={newSettings.hospitalName}
                                onChange={(e) => setNewSettings({...newSettings, hospitalName: e.target.value})}
                                placeholder="Team Defenders Hospital"
                            />
                        </div>
                        <div className={styles.fg}>
                            <label>Official Website URL</label>
                            <input 
                                type="text" 
                                value={newSettings.websiteUrl}
                                onChange={(e) => setNewSettings({...newSettings, websiteUrl: e.target.value})}
                                placeholder="https://hospital.com"
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2><FaPhone /> Contact Information</h2>
                    <div className={styles.grid}>
                        <div className={styles.fg}>
                            <label>Support Email Address</label>
                            <input 
                                type="email" 
                                value={newSettings.contactEmail}
                                onChange={(e) => setNewSettings({...newSettings, contactEmail: e.target.value})}
                                placeholder="support@hospital.com"
                            />
                        </div>
                        <div className={styles.fg}>
                            <label>Emergency Contact Phone</label>
                            <input 
                                type="text" 
                                value={newSettings.contactPhone}
                                onChange={(e) => setNewSettings({...newSettings, contactPhone: e.target.value})}
                                placeholder="+1 234 567 890"
                            />
                        </div>
                    </div>
                    <div className={styles.fg}>
                        <label>Physical Address</label>
                        <textarea 
                            value={newSettings.hospitalAddress}
                            onChange={(e) => setNewSettings({...newSettings, hospitalAddress: e.target.value})}
                            placeholder="Street, City, Country"
                        />
                    </div>
                </div>

                <div className={styles.footer}>
                    <button type="submit" className={styles.saveBtn} disabled={submitting}>
                        {submitting ? <FaSpinner className={styles.spinner} /> : <><FaSave /> Commit Changes</>}
                    </button>
                    <p className={styles.helpText}><FaCheckCircle /> These settings take effect globally across the patient and doctor portals.</p>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
