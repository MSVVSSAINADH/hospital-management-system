import React, { useState, useContext } from 'react';
import styles from './ManagePrescriptions.module.css';
import { FaFileMedical, FaSearch, FaUser, FaPills, FaNotesMedical, FaCheckCircle, FaSpinner, FaClipboardList } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const ManagePrescriptions = () => {
  const { user } = useContext(AuthContext);
  const [patientId, setPatientId] = useState('');
  const [prescriptionData, setPrescriptionData] = useState({
    patientName: '',
    patientEmail: '',
    medication: '',
    dosage: '',
    instructions: '',
  });
  const [patientFound, setPatientFound] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!patientId) return;

    setLoading(true);
    setSearchStatus('');
    setPatientFound(false);

    try {
      const response = await fetch(`${apiBase}/api/users/${patientId}`, {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      
      if (response.ok) {
        const patient = await response.json();
        setPrescriptionData((prev) => ({ 
          ...prev, 
          patientName: patient.username,
          patientEmail: patient.email 
        }));
        setPatientFound(true);
        setSearchStatus('Patient information retrieved successfully.');
      } else {
        setSearchStatus('Patient not found. Please verify the ID.');
      }
    } catch (error) {
      console.error('Error searching patient:', error);
      setSearchStatus('An error occurred during search.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrescriptionChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionData({ ...prescriptionData, [name]: value });
  };

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = {
      medications: prescriptionData.medication, // Backend expects 'medications'
      instructions: prescriptionData.instructions,
      doctorId: user?.id,
      doctorName: user?.name || user?.username, // Fallback to username
      patientId: patientId,
      patientName: prescriptionData.patientName,
      date: new Date().toISOString()
    };

    try {
      const response = await fetch(`${apiBase}/api/prescriptions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}` 
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        setSearchStatus('Prescription successfully issued and recorded.');
        setPatientFound(false);
        setPatientId('');
        setPrescriptionData({ patientName: '', patientEmail: '', medication: '', dosage: '', instructions: '' });
      } else {
        setSearchStatus('Failed to submit prescription. Please check fields.');
      }
    } catch (error) {
      setSearchStatus('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}><FaFileMedical /> Manage Prescriptions</h1>
        <p className={styles.subtitle}>Welcome, Dr. {user?.name}. Issue prescriptions based on patient ID.</p>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}><FaSearch /> Find Patient</h2>
          <form onSubmit={handleSearch} className={styles.form}>
            <div className={styles.formGroup}>
              <FaUser className={styles.inputIcon} />
              <input
                type="text"
                className={styles.input}
                placeholder="Enter Patient User ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.searchBtn} disabled={loading || !patientId}>
              {loading ? <FaSpinner className={styles.spinner} /> : 'Search'}
            </button>
          </form>
          {searchStatus && (
            <p className={`${styles.statusMessage} ${patientFound ? styles.success : styles.error}`}>
              {searchStatus}
            </p>
          )}
        </div>

        {patientFound && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <FaNotesMedical /> Prescription for {prescriptionData.patientName} ({prescriptionData.patientEmail})
            </h2>
            <form onSubmit={handleSubmitPrescription} className={styles.form}>
              <div className={styles.formGroup}>
                <FaPills className={styles.inputIcon} />
                <input
                  type="text"
                  name="medication"
                  className={styles.input}
                  placeholder="Medication Name"
                  value={prescriptionData.medication}
                  onChange={handlePrescriptionChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <FaClipboardList className={styles.inputIcon} />
                <input
                  type="text"
                  name="dosage"
                  className={styles.input}
                  placeholder="Dosage (e.g., 20mg)"
                  value={prescriptionData.dosage}
                  onChange={handlePrescriptionChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <FaNotesMedical className={styles.inputIcon} />
                <textarea
                  name="instructions"
                  className={styles.textarea}
                  placeholder="Detailed instructions for the patient"
                  value={prescriptionData.instructions}
                  onChange={handlePrescriptionChange}
                  required
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? <FaSpinner className={styles.spinner} /> : (<><FaCheckCircle /> Issue Prescription</>)}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePrescriptions;