import React, { useState, useEffect, useContext } from 'react';
import styles from './PatientPrescriptions.module.css';
import { AuthContext } from '../context/AuthContext';
import { FaFilePrescription, FaUserMd, FaCalendarAlt, FaCapsules, FaNotesMedical, FaLightbulb, FaDownload, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientPrescriptions = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8086';

    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (!user?.id) return;
            try {
                const res = await axios.get(`${apiBase}/api/prescriptions/patient/${user.id}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                setPrescriptions(res.data || []);
            } catch (err) {
                console.error('Error fetching prescriptions:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescriptions();
    }, [user, apiBase]);

    const handleDownload = (p) => {
        const content = `
PRESCRIPTION - CITY GENERAL HOSPITAL
------------------------------------
Date: ${p.date}
Patient ID: #${p.patientId}
Patient Name: ${p.patientName}
Doctor: ${p.doctorName}

MEDICINES:
${JSON.parse(p.medicines).map(m => `- ${m.name}: ${m.dosage} (${m.frequency}) for ${m.duration}`).join('\n')}

NOTES:
${p.notes}

SUGGESTIONS:
${p.suggestions}
        `;
        const element = document.createElement("a");
        const file = new Blob([content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `prescription_${p.id}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    if (loading) return <div className={styles.loading}>Loading your prescriptions...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>
                    <FaArrowLeft /> Back
                </button>
                <h1><FaFilePrescription /> My Medical Prescriptions</h1>
                <p>View and manage all prescriptions issued by your health consultants.</p>
            </header>

            {prescriptions.length === 0 ? (
                <div className={styles.emptyState}>
                    <FaFilePrescription size={64} style={{ opacity: 0.2 }} />
                    <h3>No prescriptions found</h3>
                    <p>When a doctor issues a prescription after your consultation, it will appear here.</p>
                </div>
            ) : (
                <div className={styles.prescriptionGrid}>
                    {prescriptions.map(p => {
                        const meds = JSON.parse(p.medicines);
                        return (
                            <div key={p.id} className={styles.prescriptionCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.docInfo}>
                                        <FaUserMd className={styles.icon} />
                                        <div>
                                            <h4>{p.doctorName}</h4>
                                            <span>Consultant Physician</span>
                                        </div>
                                    </div>
                                    <div className={styles.dateInfo}>
                                        <FaCalendarAlt /> {p.date}
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    <div className={styles.section}>
                                        <h5><FaCapsules /> Medications</h5>
                                        <ul className={styles.medList}>
                                            {meds.map((m, idx) => (
                                                <li key={idx}>
                                                    <strong>{m.name}</strong>
                                                    <p>{m.dosage} • {m.frequency} • {m.duration}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className={styles.section}>
                                        <h5><FaNotesMedical /> Notes</h5>
                                        <p className={styles.textBlock}>{p.notes}</p>
                                    </div>

                                    <div className={styles.section}>
                                        <h5><FaLightbulb /> Suggestions</h5>
                                        <p className={styles.textBlock}>{p.suggestions}</p>
                                    </div>
                                </div>

                                <div className={styles.cardFooter}>
                                    <button onClick={() => handleDownload(p)} className={styles.downloadBtn}>
                                        <FaDownload /> Download as PDF/Text
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PatientPrescriptions;
