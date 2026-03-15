import React, { useState, useEffect } from 'react';
import styles from './BroadcastBanner.module.css';
import { FaBullhorn, FaExclamationTriangle } from 'react-icons/fa';
import { announcementApi } from '../../api';

const BroadcastBanner = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchActive = async () => {
            try {
                const res = await announcementApi.getActive();
                const activeOnes = res.data.filter(a => a.active);
                setAnnouncements(activeOnes);
            } catch (err) {
                console.error("Banner fetch error:", err);
            }
        };
        fetchActive();
    }, []);

    useEffect(() => {
        if (announcements.length <= 1) return;
        
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length);
        }, 5000); // Cycle every 5 seconds

        return () => clearInterval(timer);
    }, [announcements]);

    if (announcements.length === 0) return null;

    const current = announcements[currentIndex];

    return (
        <div key={current.id} className={`${styles.banner} ${styles[current.type]} ${styles.fadeIn}`}>
            <div className={styles.container}>
                <div className={styles.icon}>
                    {current.type === 'emergency' ? <FaExclamationTriangle /> : <FaBullhorn />}
                </div>
                <div className={styles.content}>
                    <strong>{current.title}:</strong> {current.content}
                </div>
                {announcements.length > 1 && (
                    <div className={styles.count}>
                        {currentIndex + 1} / {announcements.length}
                    </div>
                )}
                <div className={styles.date}>
                    {new Date(current.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default BroadcastBanner;
