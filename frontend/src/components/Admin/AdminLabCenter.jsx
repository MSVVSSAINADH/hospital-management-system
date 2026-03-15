import React, { useState, useEffect, useContext } from 'react';
import styles from './AdminLabCenter.module.css';
import { FaFlask, FaClipboardCheck, FaSearch, FaUser, FaClock, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { labRequestApi, notificationApi } from '../../api';
import Card from '../common/Card';

const AdminLabCenter = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // pending, completed
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [resultText, setResultText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchRequests = async () => {
        try {
            const res = await labRequestApi.getAll();
            setRequests(res.data);
        } catch (err) {
            console.error("Error fetching lab requests:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleUploadResult = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await labRequestApi.uploadResults(selectedRequest.id, resultText);
            
            // Also notify patient
            const notifyPayload = {
                userId: selectedRequest.patientId,
                title: "Lab Results Ready",
                message: `Results for your ${selectedRequest.testName} have been uploaded.`,
                type: "info"
            };
            await notificationApi.create(notifyPayload);

            alert('Results uploaded successfully!');
            setSelectedRequest(null);
            setResultText('');
            await fetchRequests();
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload results. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredRequests = requests.filter(r => r.status === filter);

    if (loading) return <div className={styles.loading}>Accessing Laboratory Database...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1><FaFlask /> Laboratory Fulfillment Center</h1>
                <p>Process pending diagnostic orders and notify patients of results.</p>
            </header>

            <div className={styles.tabActions}>
                <button 
                   className={filter === 'pending' ? styles.activeTab : ''} 
                   onClick={() => setFilter('pending')}
                >
                    Pending Orders ({requests.filter(r => r.status === 'pending').length})
                </button>
                <button 
                   className={filter === 'completed' ? styles.activeTab : ''} 
                   onClick={() => setFilter('completed')}
                >
                    Completed ({requests.filter(r => r.status === 'completed').length})
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.reqList}>
                    {filteredRequests.length > 0 ? filteredRequests.map(req => (
                        <div 
                            key={req.id} 
                            className={`${styles.reqCard} ${selectedRequest?.id === req.id ? styles.selected : ''}`}
                            onClick={() => setSelectedRequest(req)}
                        >
                            <div className={styles.reqHeader}>
                                <strong>{req.testName}</strong>
                                <span className={styles.date}>{new Date(req.requestedAt).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.reqBody}>
                                <p><FaUser /> Patient ID: {req.patientId}</p>
                                <p><FaClock /> Requested by Dr. {req.doctorName}</p>
                            </div>
                        </div>
                    )) : <p className={styles.empty}>No {filter} requests found.</p>}
                </div>

                <div className={styles.fulfillmentArea}>
                    {selectedRequest ? (
                        <div className={styles.formCard}>
                            <h3><FaFlask /> Fulfill: {selectedRequest.testName}</h3>
                            <div className={styles.metaInfo}>
                                <p><strong>Patient ID:</strong> {selectedRequest.patientId}</p>
                                <p><strong>Indications:</strong> {selectedRequest.clinicalIndication}</p>
                            </div>

                            {selectedRequest.status === 'pending' ? (
                                <form onSubmit={handleUploadResult} className={styles.resultForm}>
                                    <label>Laboratory Findings & Observations</label>
                                    <textarea 
                                        placeholder="Enter detailed test results here..."
                                        value={resultText}
                                        onChange={(e) => setResultText(e.target.value)}
                                        required
                                    />
                                    <button type="submit" disabled={submitting}>
                                        {submitting ? <FaSpinner className={styles.spinner} /> : <><FaCheckCircle /> Authorize & Send Results</>}
                                    </button>
                                </form>
                            ) : (
                                <div className={styles.finalResults}>
                                    <label>Completed Results</label>
                                    <div className={styles.resultBox}>{selectedRequest.results}</div>
                                    <span className={styles.stamp}>AUTHORIZED ON {new Date(selectedRequest.completedAt).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.placeholderCard}>
                            <FaClipboardCheck size={48} />
                            <p>Select a request from the list to begin fulfillment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLabCenter;
