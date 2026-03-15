import React, { useState, useEffect, useContext } from 'react';
import styles from './DoctorFeedback.module.css';
import { FaStar, FaUserCircle, FaQuoteLeft, FaChartBar, FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const DoctorFeedback = () => {
    const { user } = useContext(AuthContext);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        avgRating: 0,
        totalReviews: 0,
        distribution: [0, 0, 0, 0, 0]
    });

    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";

    useEffect(() => {
        const fetchFeedback = async () => {
            if (!user?.id) return;
            try {
                const response = await fetch(`${apiBase}/api/feedback/doctor/${user.id}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFeedbacks(data);
                    calculateStats(data);
                }
            } catch (err) {
                console.error("Error fetching feedback:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, [user, apiBase]);

    const calculateStats = (data) => {
        if (data.length === 0) return;
        const total = data.length;
        const sum = data.reduce((acc, f) => acc + f.rating, 0);
        const dist = [0, 0, 0, 0, 0];
        data.forEach(f => dist[f.rating - 1]++);
        setStats({
            avgRating: (sum / total).toFixed(1),
            totalReviews: total,
            distribution: dist.reverse() // 5 stars down to 1
        });
    };

    if (loading) return <div className={styles.loading}>Analyzing patient reviews...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1><FaChartBar /> Performance & Patient Sentiment</h1>
                <p>Understand how patients perceive your consultations.</p>
            </header>

            <div className={styles.dashboard}>
                {/* Stats Summary Card */}
                <div className={styles.statsCard}>
                    <div className={styles.ratingOverview}>
                        <div className={styles.bigScore}>{stats.avgRating}</div>
                        <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} color={i < Math.round(stats.avgRating) ? "#fbbf24" : "#e2e8f0"} />
                            ))}
                        </div>
                        <p>{stats.totalReviews} Total Reviews</p>
                    </div>
                    <div className={styles.distribution}>
                        {stats.distribution.map((count, i) => (
                            <div key={i} className={styles.distRow}>
                                <span>{5 - i} <FaStar size={10} /></span>
                                <div className={styles.barContainer}>
                                    <div 
                                        className={styles.bar} 
                                        style={{ width: `${(count / stats.totalReviews) * 100}%` }}
                                    ></div>
                                </div>
                                <span className={styles.count}>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feedback List */}
                <div className={styles.feedbackList}>
                    <h2 className={styles.listTitle}><FaQuoteLeft /> Latest Testimonials</h2>
                    {feedbacks.length > 0 ? feedbacks.slice().reverse().map(f => (
                        <div key={f.id} className={styles.feedbackItem}>
                            <div className={styles.fHeader}>
                                <div className={styles.uInfo}>
                                    <FaUserCircle size={24} color="#94a3b8" />
                                    <span>Verified Patient</span>
                                </div>
                                <div className={styles.fStars}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < f.rating ? "#fbbf24" : "#e2e8f0"} size={14} />
                                    ))}
                                </div>
                            </div>
                            <p className={styles.comment}>{f.comment}</p>
                            <span className={styles.date}>{new Date(f.createdAt).toLocaleDateString()}</span>
                        </div>
                    )) : <p className={styles.empty}>No feedback received yet. New reviews will appear here.</p>}
                </div>
            </div>
        </div>
    );
};

export default DoctorFeedback;
