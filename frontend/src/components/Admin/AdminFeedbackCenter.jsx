import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styles from './AdminFeedbackCenter.module.css';
import { FaStar, FaQuoteLeft, FaUserMd, FaFilter, FaCheckCircle, FaHospital, FaChartLine, FaSync } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const AdminFeedbackCenter = () => {
    const { user } = useContext(AuthContext);
    const [feedbacks, setFeedbacks] = useState([]);
    const [hospitalDepts, setHospitalDepts] = useState(['General']);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDept, setSelectedDept] = useState('All');
    const [updating, setUpdating] = useState(null);
    const [responseMap, setResponseMap] = useState({});

    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!user || !user.token) {
                console.warn("DEBUG: No valid user or token found in context!");
                setError("Authentication required. Please re-login.");
                setLoading(false);
                return;
            }

            console.log("DEBUG: Requesting feedback with token:", user.token.substring(0, 15) + "...");
            const authHeader = { 'Authorization': `Bearer ${user.token}` };

            // 1. Fetch Feedback
            try {
                const fbRes = await axios.get(`${apiBase}/api/feedback`, { headers: authHeader });
                console.log("DEBUG: Feedback response status:", fbRes.status);
                setFeedbacks(fbRes.data);
            } catch (fbErr) {
                console.error("DEBUG: /api/feedback failed", fbErr.response?.status, fbErr.message);
                throw fbErr; // Re-throw to catch in outer block
            }

            // 2. Fetch Departments
            try {
                const deptRes = await axios.get(`${apiBase}/api/doctors/departments`, { headers: authHeader });
                console.log("DEBUG: Departments response status:", deptRes.status);
                setHospitalDepts(['General', ...deptRes.data]);
            } catch (deptErr) {
                console.warn("DEBUG: /api/doctors/departments failed", deptErr.response?.status);
                // Don't throw here, feedback is more important
            }
            
        } catch (err) {
            console.error("DEBUG: Admin Feedback Global Error:", err);
            setError(`[${err.response?.status || 'ERR'}] ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.token) fetchData();
    }, [user, apiBase]);

    const departments = ['All', ...new Set([...hospitalDepts])];
    
    // Sort departments for cleaner UI
    departments.sort();

    const filteredFeedbacks = selectedDept === 'All' 
        ? feedbacks 
        : feedbacks.filter(f => (f.doctorDepartment || 'General') === selectedDept);

    const getDeptStats = () => {
        const stats = {};
        feedbacks.forEach(f => {
            const dept = f.doctorDepartment || 'General';
            if (!stats[dept]) stats[dept] = { sum: 0, count: 0 };
            stats[dept].sum += f.rating;
            stats[dept].count++;
        });
        return stats;
    };

    const deptStats = getDeptStats();

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`${apiBase}/api/feedback/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` 
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
            }
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    const handleAdminResponse = async (id) => {
        try {
            const res = await fetch(`${apiBase}/api/feedback/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` 
                },
                body: JSON.stringify({ adminComment: responseMap[id] })
            });
            if (res.ok) {
                setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, adminComment: responseMap[id] } : f));
                setUpdating(null);
                alert("Response saved successfully.");
            }
        } catch (err) {
            console.error("Error saving response:", err);
        }
    };

    if (loading) return <div className={styles.loading}>Loading Patient Satisfaction Data...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1><FaStar /> Quality Assurance & Feedback Hub</h1>
                <p>Global overview of patient sentiment across departments and doctors.</p>
            </header>

            <div className={styles.controls}>
                <div className={styles.filterGroup}>
                    <FaFilter />
                    <label>Filter by Department:</label>
                    <select 
                        className={styles.deptSelect}
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                    >
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className={styles.totalStats}>
                    <button onClick={fetchData} className={styles.saveBtn} style={{ marginRight: '1rem' }}>
                        <FaSync /> Reload Data
                    </button>
                    <strong>Total Reviews: {filteredFeedbacks.length}</strong>
                </div>
            </div>

            {error && <div style={{ color: 'red', margin: '1rem 0', fontWeight: 'bold' }}>Error: {error}</div>}

            <section className={styles.analyticsSection}>
                <h2 className={styles.sectionTitle}><FaChartLine /> Department Performance</h2>
                <div className={styles.analyticsGrid}>
                    {Object.entries(deptStats).map(([dept, data]) => (
                        <div key={dept} className={styles.deptStatCard} onClick={() => setSelectedDept(dept)}>
                            <h4>{dept}</h4>
                            <div className={styles.deptScore}>
                                {(data.sum / data.count).toFixed(1)}
                                <small>/ 5</small>
                            </div>
                            <span>{data.count} reviews</span>
                        </div>
                    ))}
                </div>
            </section>

            <div className={styles.content}>
                <div className={styles.summary}>
                    <div className={styles.scoreCard}>
                        <h3>Global Satisfaction</h3>
                        <div className={styles.bigNum}>
                            {feedbacks.length > 0 
                                ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1) 
                                : '0.0'}
                        </div>
                        <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} color={i < (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length) ? "#fbbf24" : "#e2e8f0"} />
                            ))}
                        </div>
                        <span>Based on {feedbacks.length} global interactions</span>
                    </div>
                </div>

                <div className={styles.list}>
                    {filteredFeedbacks.length > 0 ? filteredFeedbacks.slice().reverse().map(f => (
                        <div key={f.id} className={`${styles.fbCard} ${styles['status_' + (f.status || 'pending').toLowerCase()]}`}>
                            <div className={styles.fbHeader}>
                                <div className={styles.docInfo}>
                                    <FaUserMd />
                                    <div className={styles.docName}>
                                        <span>Dr. {f.doctorName || 'General Staff'}</span>
                                        <small><FaHospital /> {f.doctorDepartment || 'General'}</small>
                                    </div>
                                    <span className={`${styles.statusBadge} ${styles['status_' + (f.status || 'pending').toLowerCase()]}`}>
                                        {f.status || 'PENDING'}
                                    </span>
                                </div>
                                <div className={styles.fbStars}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < f.rating ? "#fbbf24" : "#e2e8f0"} size={12} />
                                    ))}
                                </div>
                            </div>
                            <blockquote className={styles.quote}>
                                <FaQuoteLeft className={styles.quoteIcon} />
                                {f.comment}
                            </blockquote>
                            
                            {f.adminComment && (
                                <div className={styles.adminResponse}>
                                    <strong>Admin Response:</strong>
                                    <p>{f.adminComment}</p>
                                </div>
                            )}

                            <div className={styles.fbFooter}>
                                <div className={styles.footerLeft}>
                                    <span>{new Date(f.createdAt).toLocaleDateString()}</span>
                                    <span className={styles.verified}><FaCheckCircle /> Verified Patient</span>
                                </div>
                                <div className={styles.actions}>
                                    <button onClick={() => handleUpdateStatus(f.id, 'VERIFIED')} className={styles.verifyBtn}>Verify</button>
                                    <button onClick={() => setUpdating(f.id)} className={styles.respondBtn}>Respond</button>
                                    <button onClick={() => handleUpdateStatus(f.id, 'RESOLVED')} className={styles.resolveBtn}>Resolve</button>
                                </div>
                            </div>

                            {updating === f.id && (
                                <div className={styles.responseForm}>
                                    <textarea 
                                        placeholder="Write improvement plan or response..."
                                        value={responseMap[f.id] || f.adminComment || ''}
                                        onChange={(e) => setResponseMap({...responseMap, [f.id]: e.target.value})}
                                    />
                                    <div className={styles.responseBtns}>
                                        <button onClick={() => handleAdminResponse(f.id)} className={styles.saveBtn}>Save Response</button>
                                        <button onClick={() => setUpdating(null)} className={styles.cancelBtn}>Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : <p className={styles.empty}>No feedback matching the current filters.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminFeedbackCenter;
