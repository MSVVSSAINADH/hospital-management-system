import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ConsultationRoom.module.css';
import { FaUserCircle, FaFilePrescription, FaCapsules, FaLaptopMedical, FaCheckDouble, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const ConsultationRoom = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking } = location.state || {};

    const [notes, setNotes] = useState('');
    const [suggestions, setSuggestions] = useState('');
    const [medicines, setMedicines] = useState([
        { name: '', dosage: '', frequency: '', duration: '' }
    ]);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState(null);

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8086';

    const defaultMedicines = [
        "Paracetamol 500mg",
        "Amoxicillin 250mg",
        "Cetirizine 10mg",
        "Ibuprofen 400mg",
        "Omeprazole 20mg",
        "Metformin 500mg",
        "Amlodipine 5mg",
        "Atorvastatin 10mg",
        "Azithromycin 500mg",
        "Pantoprazole 40mg"
    ];

    const commonSuggestions = [
        "Rest for 3 days",
        "Increase fluid intake",
        "Avoid spicy food",
        "Monitor blood pressure daily",
        "Follow up in a week"
    ];

    useEffect(() => {
        if (!booking) {
            navigate('/doctor/dashboard');
            return;
        }

        const fetchHistory = async () => {
            setHistoryLoading(true);
            const userStr = sessionStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);

            try {
                const res = await axios.get(`${apiBase}/api/prescriptions/patient/${booking.userId}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                setHistory(res.data || []);
            } catch (err) {
                console.error("Error fetching patient history:", err);
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchHistory();
    }, [booking, navigate, apiBase]);

    const handleAddMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }]);
    };

    const handleRemoveMedicine = (index) => {
        const newMeds = [...medicines];
        newMeds.splice(index, 1);
        setMedicines(newMeds);
    };

    const handleMedChange = (index, field, value) => {
        const newMeds = [...medicines];
        newMeds[index][field] = value;
        setMedicines(newMeds);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const userStr = sessionStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);

        const payload = {
            bookingId: booking.id,
            patientId: booking.userId,
            doctorId: user.id,
            doctorName: user.name || user.fullName || 'Dr. ' + user.username,
            doctorDepartment: user.department || 'General',
            patientName: booking.patientName || `Patient ${booking.userId}`,
            date: new Date().toLocaleDateString(),
            medicines: JSON.stringify(medicines),
            notes: notes,
            suggestions: suggestions
        };

        try {
            await axios.post(`${apiBase}/api/prescriptions`, payload, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            alert('Prescription issued successfully! Appointment marked as completed.');
            navigate('/doctor/dashboard');
        } catch (error) {
            console.error('DEBUG: Error saving prescription:', error);
            if (error.response) {
                console.error('DEBUG: Server Response Data:', error.response.data);
                console.error('DEBUG: Server Response Status:', error.response.status);
                alert(`Failed to save prescription: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                console.error('DEBUG: No response received:', error.request);
                alert('Failed to save prescription: No response from server. Is the backend running?');
            } else {
                console.error('DEBUG: Request error:', error.message);
                alert(`Failed to save prescription: ${error.message}`);
            }
        }
    };

    if (!booking) return null;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => navigate('/doctor/dashboard')} className={styles.backBtn}>
                    <FaArrowLeft /> Exit Room
                </button>
                <div className={styles.titleInfo}>
                    <h1><FaLaptopMedical /> Digital Consultation Room</h1>
                    <p>Issuing prescription for appointment ID: #{booking.id}</p>
                </div>
            </header>

            <div className={styles.layout}>
                <aside className={styles.patientSidebar}>
                    <div className={styles.patientCard}>
                        <div className={styles.avatar}>
                            <FaUserCircle size={60} />
                        </div>
                        <h3>{booking.patientName || `Patient ${booking.userId}`}</h3>
                        <div className={styles.pDetail}>
                            <span>Patient ID:</span> <strong>#{booking.userId}</strong>
                        </div>
                        <div className={styles.pDetail}>
                            <span>Time Slot:</span> <strong>{booking.timeSlot}</strong>
                        </div>
                        <hr />
                        <div className={styles.pComp}>
                            <span>Complaint:</span>
                            <p>{booking.description || 'No description provided.'}</p>
                        </div>
                    </div>

                    <div className={styles.historyBox}>
                        <h4><FaFilePrescription /> Previous Prescriptions</h4>
                        {historyLoading ? (
                            <p>Loading history...</p>
                        ) : history.length > 0 ? (
                            <div className={styles.historyList}>
                                {history.map(h => (
                                    <div key={h.id} className={styles.historyItem} onClick={() => setSelectedHistory(h)} title="Click to view details">
                                        <div className={styles.hDate}>{h.date}</div>
                                        <div className={styles.hDoc}>Dr. {h.doctorName}</div>
                                        <p className={styles.hNotes}>{h.notes && h.notes.substring(0, 50)}...</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.noHistory}>No previous records found.</p>
                        )}
                    </div>

                    <div className={styles.suggestionsBox}>
                        <h4><FaCheckDouble /> Common Suggestions</h4>
                        <div className={styles.suggestionTags}>
                            {commonSuggestions.map(s => (
                                <button key={s} type="button" onClick={() => setSuggestions(prev => prev ? prev + ', ' + s : s)}>
                                    + {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className={styles.consultationMain}>
                    <form onSubmit={handleSubmit} className={styles.prescriptionForm}>
                        <section className={styles.formSection}>
                            <h3><FaCapsules /> Medication (Medicines)</h3>
                            <div className={styles.medTableWrapper}>
                                <table className={styles.medTable}>
                                    <thead>
                                        <tr>
                                            <th>Medicine Name</th>
                                            <th>Dosage</th>
                                            <th>Frequency</th>
                                            <th>Duration</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {medicines.map((med, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input 
                                                        list="med-list"
                                                        value={med.name}
                                                        onChange={(e) => handleMedChange(index, 'name', e.target.value)}
                                                        placeholder="e.g. Paracetamol"
                                                        required
                                                    />
                                                    <datalist id="med-list">
                                                        {defaultMedicines.map(m => <option key={m} value={m} />)}
                                                    </datalist>
                                                </td>
                                                <td>
                                                    <input 
                                                        value={med.dosage}
                                                        onChange={(e) => handleMedChange(index, 'dosage', e.target.value)}
                                                        placeholder="e.g. 500mg"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <select 
                                                        value={med.frequency}
                                                        onChange={(e) => handleMedChange(index, 'frequency', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="1-0-0">Once a day (Morning)</option>
                                                        <option value="0-0-1">Once a day (Night)</option>
                                                        <option value="1-0-1">Twice a day (M/N)</option>
                                                        <option value="1-1-1">Thrice a day</option>
                                                        <option value="SOS">SOS (As needed)</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input 
                                                        value={med.duration}
                                                        onChange={(e) => handleMedChange(index, 'duration', e.target.value)}
                                                        placeholder="e.g. 5 Days"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    {medicines.length > 1 && (
                                                        <button type="button" onClick={() => handleRemoveMedicine(index)} className={styles.removeBtn}>
                                                            <FaTrash />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button type="button" onClick={handleAddMedicine} className={styles.addMedBtn}>
                                <FaPlus /> Add Another Medicine
                            </button>
                        </section>

                        <div className={styles.gridSection}>
                            <section className={styles.formSection}>
                                <h3>Notes / Symptoms</h3>
                                <textarea 
                                    value={notes} 
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Enter clinical observations, symptoms etc."
                                    required
                                />
                            </section>
                            <section className={styles.formSection}>
                                <h3>General Suggestions</h3>
                                <textarea 
                                    value={suggestions} 
                                    onChange={(e) => setSuggestions(e.target.value)}
                                    placeholder="Dietary advice, rest, next visit etc."
                                    required
                                />
                            </section>
                        </div>

                        <div className={styles.actionArea}>
                            <button type="submit" className={styles.submitBtn}>
                                <FaFilePrescription /> Secure Post & Finalize Consultation
                            </button>
                            <p>Note: This will mark the appointment as <strong>COMPLETED</strong>.</p>
                        </div>
                    </form>
                </main>
            </div>
            {selectedHistory && (
                <div className={styles.modalOverlay} onClick={() => setSelectedHistory(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <header className={styles.modalHeader}>
                            <h2><FaFilePrescription /> Prescription Details</h2>
                            <button onClick={() => setSelectedHistory(null)} className={styles.closeBtn}>&times;</button>
                        </header>
                        
                        <div className={styles.modalBody}>
                            <div className={styles.modalMeta}>
                                <div><strong>Date:</strong> {selectedHistory.date}</div>
                                <div><strong>Doctor:</strong> Dr. {selectedHistory.doctorName}</div>
                            </div>

                            <div className={styles.modalSection}>
                                <h4>Medicines</h4>
                                <table className={styles.historyMedTable}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Dosage</th>
                                            <th>Freq.</th>
                                            <th>Dur.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {JSON.parse(selectedHistory.medicines || '[]').map((m, i) => (
                                            <tr key={i}>
                                                <td>{m.name}</td>
                                                <td>{m.dosage}</td>
                                                <td>{m.frequency}</td>
                                                <td>{m.duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className={styles.modalSection}>
                                <h4>Clinical Notes</h4>
                                <p className={styles.modalText}>{selectedHistory.notes}</p>
                            </div>

                            <div className={styles.modalSection}>
                                <h4>Suggestions</h4>
                                <p className={styles.modalText}>{selectedHistory.suggestions}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsultationRoom;
