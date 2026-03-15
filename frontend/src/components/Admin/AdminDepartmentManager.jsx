import React, { useState, useEffect, useContext } from 'react';
import styles from './AdminDepartmentManager.module.css';
import { FaHospital, FaPlus, FaTrash, FaEdit, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const AdminDepartmentManager = () => {
    const { user } = useContext(AuthContext);
    const [departments, setDepartments] = useState([]);
    const [newDept, setNewDept] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";

    const fetchDepts = async () => {
        try {
            // Reusing SystemConfig to store departments as a JSON string
            const res = await fetch(`${apiBase}/api/system-config/hospital_departments`);
            if (res.ok) {
                const data = await res.json();
                setDepartments(JSON.parse(data.configValue));
            } else {
                // Initialize if not exists
                setDepartments(['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine']);
            }
        } catch (err) {
            console.error("Error fetching depts:", err);
            setDepartments(['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine']);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepts();
    }, [apiBase]);

    const saveDepts = async (updatedList) => {
        setSubmitting(true);
        try {
            await fetch(`${apiBase}/api/system-config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify({ configKey: 'hospital_departments', configValue: JSON.stringify(updatedList) })
            });
            setDepartments(updatedList);
        } catch (err) {
            console.error("Save failed", err);
        } finally {
            setSubmitting(false);
        }
    };

    const addDept = (e) => {
        e.preventDefault();
        if (!newDept || departments.includes(newDept)) return;
        const newList = [...departments, newDept];
        saveDepts(newList);
        setNewDept('');
    };

    const deleteDept = (name) => {
        if (!window.confirm(`Remove ${name} department?`)) return;
        const newList = departments.filter(d => d !== name);
        saveDepts(newList);
    };

    if (loading) return <div className={styles.loading}>Organizing Hospital Wings...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1><FaHospital /> Department Management</h1>
                <p>Add or remove hospital specializations and departments.</p>
            </header>

            <div className={styles.content}>
                <div className={styles.addPanel}>
                    <form onSubmit={addDept} className={styles.addForm}>
                        <label>New Department Name</label>
                        <div className={styles.inputGroup}>
                            <input 
                                type="text" 
                                placeholder="e.g. Oncology"
                                value={newDept}
                                onChange={(e) => setNewDept(e.target.value)}
                                required
                            />
                            <button type="submit" disabled={submitting}>
                                {submitting ? <FaSpinner className={styles.spinner} /> : <FaPlus />} Add
                            </button>
                        </div>
                    </form>
                </div>

                <div className={styles.deptGrid}>
                    {departments.map(dept => (
                        <div key={dept} className={styles.deptCard}>
                            <div className={styles.deptIcon}><FaHospital /></div>
                            <div className={styles.deptInfo}>
                                <strong>{dept}</strong>
                                <span>Active Department</span>
                            </div>
                            <button className={styles.deleteBtn} onClick={() => deleteDept(dept)}><FaTrash /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDepartmentManager;
