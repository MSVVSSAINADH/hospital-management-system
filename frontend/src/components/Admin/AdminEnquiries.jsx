import React, { useState, useEffect, useContext } from 'react';
import styles from './AdminEnquiries.module.css';
import { FaInbox, FaEnvelopeOpen, FaTrash, FaUser, FaHistory, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const AdminEnquiries = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMsg, setSelectedMsg] = useState(null);

    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${apiBase}/api/contact-messages`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) setMessages(await res.json());
        } catch (err) {
            console.error("Error loading enquiries:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [user, apiBase]);

    const markAsRead = async (id) => {
        try {
            await fetch(`${apiBase}/api/contact-messages/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            fetchMessages();
        } catch (err) {
            console.error("Error marking read", err);
        }
    };

    const deleteMsg = async (id) => {
        if (!window.confirm('Delete this message permanently?')) return;
        try {
            await fetch(`${apiBase}/api/contact-messages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setSelectedMsg(null);
            fetchMessages();
        } catch (err) {
            console.error("Error deleting", err);
        }
    };

    if (loading) return <div className={styles.loading}>Opening Enquiries Inbox...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1><FaInbox /> Public Enquiries</h1>
                <p>Manage messages and feedback from the hospital's public contact page.</p>
            </header>

            <div className={styles.layout}>
                <aside className={styles.msgList}>
                    {messages.length > 0 ? messages.slice().reverse().map(msg => (
                        <div 
                            key={msg.id} 
                            className={`${styles.msgCard} ${selectedMsg?.id === msg.id ? styles.active : ''} ${!msg.read ? styles.unread : ''}`}
                            onClick={() => {
                                setSelectedMsg(msg);
                                if (!msg.read) markAsRead(msg.id);
                            }}
                        >
                            <div className={styles.msgTitle}>
                                <strong>{msg.name}</strong>
                                <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className={styles.snippet}>{msg.subject}</p>
                            {!msg.read && <span className={styles.unreadTag}>NEW</span>}
                        </div>
                    )) : <p className={styles.empty}>Your inbox is empty.</p>}
                </aside>

                <main className={styles.viewer}>
                    {selectedMsg ? (
                        <div className={styles.msgContent}>
                            <div className={styles.viewerHeader}>
                                <h2>{selectedMsg.subject}</h2>
                                <button className={styles.deleteBtn} onClick={() => deleteMsg(selectedMsg.id)}><FaTrash /> Delete</button>
                            </div>
                            <div className={styles.senderInfo}>
                                <div className={styles.avatar}><FaUser /></div>
                                <div>
                                    <strong>{selectedMsg.name}</strong>
                                    <p>{selectedMsg.email}</p>
                                </div>
                            </div>
                            <div className={styles.body}>
                                {selectedMsg.message}
                            </div>
                            <div className={styles.footer}>
                                <span>Received: {new Date(selectedMsg.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.placeholder}>
                            <FaEnvelopeOpen size={48} />
                            <p>Select a message to read</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminEnquiries;
