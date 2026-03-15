import React, { useState, useEffect, useContext } from 'react';
import styles from './AdminFinance.module.css';
import { FaChartLine, FaMoneyBillWave, FaCalendarAlt, FaStethoscope, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const AdminFinance = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalConsultations: 0,
        pendingRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${apiBase}/api/admin/finance/stats`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (res.ok) setStats(await res.json());
            } catch (err) {
                console.error("Finance fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user, apiBase]);

    if (loading) return <div className={styles.loading}>Generating Financial Report...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1><FaMoneyBillWave /> Financial Analytics</h1>
                <p>Monitor hospital revenue, appointment growth, and commercial performance.</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={`${styles.iconBox} ${styles.blue}`}><FaMoneyBillWave /></div>
                        <span className={styles.trend}>Live Revenue</span>
                    </div>
                    <div className={styles.statValue}>${stats.totalRevenue.toLocaleString()}</div>
                    <div className={styles.statLabel}>Total Realized Revenue</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={`${styles.iconBox} ${styles.teal}`}><FaStethoscope /></div>
                        <span className={styles.trend}>Completed</span>
                    </div>
                    <div className={styles.statValue}>{stats.totalConsultations}</div>
                    <div className={styles.statLabel}>Completed Consultations</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={`${styles.iconBox} ${styles.orange}`}><FaCalendarAlt /></div>
                        <span className={styles.trend}>Awaiting</span>
                    </div>
                    <div className={styles.statValue}>${stats.pendingRevenue.toLocaleString()}</div>
                    <div className={styles.statLabel}>Projected (Pending) Revenue</div>
                </div>
            </div>

            <div className={styles.chartSection}>
                <div className={styles.dummyChartCard}>
                    <h3>Monthly Revenue Growth</h3>
                    <div className={styles.dummyChart}>
                        {stats.monthlyRevenue && Object.keys(stats.monthlyRevenue).length > 0 ? 
                            Object.entries(stats.monthlyRevenue).map(([month, val]) => (
                                <div key={month} className={styles.bar} style={{ height: `${Math.min(100, (val / stats.totalRevenue) * 100 || 10)}%` }}>
                                    <span>{month}</span>
                                </div>
                            )) : (
                                <div className={styles.bar} style={{ height: '40%' }}><span>No Data</span></div>
                            )
                        }
                    </div>
                </div>
                
                <div className={styles.revenueList}>
                   <h3>Recent Income Sources</h3>
                   {stats.recentTransactions && stats.recentTransactions.length > 0 ? 
                    stats.recentTransactions.map((tx, idx) => (
                        <div key={idx} className={styles.incomeItem}>
                            <span>{tx.service}</span>
                            <strong>${tx.amount.toLocaleString()}</strong>
                        </div>
                    )) : (
                        <p className={styles.empty}>No recent transactions recorded.</p>
                    )}
                   <p className={styles.disclaimer}>* Statistics are updated in real-time as consultations are completed.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminFinance;
