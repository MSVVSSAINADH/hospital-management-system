import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from './MedicalRecords.module.css';
import { FaClipboardList, FaUserMd, FaCalendarAlt, FaHistory, FaSearch, FaNotesMedical, FaStethoscope, FaStar, FaCommentDots } from 'react-icons/fa';
import axios from 'axios';

const MedicalRecords = () => {
    const { user } = useContext(AuthContext);
    const [records, setRecords] = useState([]);
    const [allFeedback, setAllFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Feedback Form State
    const [submittingId, setSubmittingId] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";

    const fetchData = async () => {
        if (!user?.id || !user?.token) return;
        setLoading(true);
        try {
            // Fetch Records
            const recRes = await axios.get(`${apiBase}/api/medical-records/patient/${user.id}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setRecords(recRes.data || []);

            // Fetch all feedback for this patient
            const feedRes = await axios.get(`${apiBase}/api/feedback`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            // Filter locally for this patient's ID if backend doesn't have a dedicated endpoint yet
            const patientFeedback = (feedRes.data || []).filter(f => f.patientId === user.id);
            setAllFeedback(patientFeedback);
            
        } catch (error) {
            console.error("Error fetching medical data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user, apiBase]);

    const handleFeedbackSubmit = async (record) => {
        if (rating === 0) {
            alert("Please select a star rating.");
            return;
        }

        const payload = {
            patientId: user.id,
            bookingId: record.bookingId,
            doctorId: record.doctorId,
            doctorName: record.doctorName,
            doctorDepartment: record.doctorDepartment || 'General',
            rating: rating,
            comment: comment,
            status: "PENDING"
        };

        setSubmittingId(record.id);
        try {
            await axios.post(`${apiBase}/api/feedback`, payload, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            alert("Thank you for your feedback!");
            setRating(0);
            setComment('');
            fetchData(); // Refresh to show the new feedback
        } catch (err) {
            console.error("DEBUG: Feedback submit error:", err);
            if (err.response) {
                console.error("DEBUG: Response data:", err.response.data);
                alert(`Failed to submit feedback: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
            } else {
                alert(`Failed to submit feedback: ${err.message}`);
            }
        } finally {
            setSubmittingId(null);
        }
    };

    const filteredRecords = records.filter(record => 
        (record.recordType && record.recordType.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.doctorName && record.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.details && record.details.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <FaHistory className={styles.spin} />
                    <p>Loading your medical history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1><FaHistory /> Medical History & Records</h1>
                <div className={styles.searchBar}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search records by type, doctor, or details..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className={styles.recordList}>
                {records.length > 0 ? (
                    filteredRecords.map(record => {
                        const existingFeedback = allFeedback.find(f => f.bookingId === record.bookingId);
                        
                        return (
                            <div key={record.id} className={styles.recordCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.doctorInfo}>
                                        <span className={styles.typeBadge}>
                                            {record.recordType === 'Consultation' ? <FaStethoscope /> : <FaClipboardList />} {record.recordType}
                                        </span>
                                        <h3><FaUserMd /> {record.doctorName}</h3>
                                        <span className={styles.date}>
                                            <FaCalendarAlt /> {new Date(record.recordDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <FaClipboardList size={24} className={styles.watermark} />
                                </div>
                                <div className={styles.details}>
                                    <h4>Findings & Prescription Summary</h4>
                                    <div className={styles.content}>
                                        {record.details && record.details.split('\n').map((line, i) => (
                                            <p key={i}>{line}</p>
                                        ))}
                                    </div>
                                </div>

                                {/* Feedback Section */}
                                <div className={styles.feedbackSection}>
                                    <h4 className={styles.feedbackTitle}><FaCommentDots /> Service Feedback</h4>
                                    
                                    {existingFeedback ? (
                                        <div className={styles.existingFeedback}>
                                            <div className={styles.ratingDisplay}>
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} color={i < existingFeedback.rating ? "#fbbf24" : "#e2e8f0"} />
                                                ))}
                                            </div>
                                            <p className={styles.feedbackText}>"{existingFeedback.comment}"</p>
                                            {existingFeedback.adminComment && (
                                                <div className={styles.adminReply}>
                                                    <strong>Admin Reply:</strong> {existingFeedback.adminComment}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={styles.feedbackForm}>
                                            <div className={styles.starRating}>
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar 
                                                        key={i} 
                                                        className={`${styles.star} ${rating > i ? styles.starActive : ''}`}
                                                        onClick={() => setRating(i + 1)}
                                                    />
                                                ))}
                                            </div>
                                            <textarea 
                                                className={styles.commentInput}
                                                placeholder="Share your experience with this consultation..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                            <button 
                                                className={styles.submitFeedbackBtn}
                                                onClick={() => handleFeedbackSubmit(record)}
                                                disabled={submittingId === record.id}
                                            >
                                                {submittingId === record.id ? 'Submitting...' : 'Submit Review'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={styles.emptyState}>
                        <FaNotesMedical className={styles.emptyIcon} />
                        <p>No medical records found. Your digital health history will update after your next visit.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicalRecords;
