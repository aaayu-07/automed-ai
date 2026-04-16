import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const History = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                if (user && user.role === 'admin') {
                    const res = await api.get('/admin/predictions');
                    setHistory(res.data);
                } else {
                    const res = await api.get('/predict/history');
                    setHistory(res.data);
                }
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };
        fetchHistory();
    }, [user]);

    const downloadReport = async (id) => {
        try {
            const res = await api.get(`/predict/report/${id}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error("Download failed", e);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ marginTop: '2rem', flex: 1, paddingBottom: '3rem' }}>
                <div className="flex items-center justify-between mb-8 animate-fade-in">
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Diagnostic <span style={{ color: 'var(--primary)' }}>Archives</span></h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {user?.role === 'admin'
                                ? 'Secure global record of all AI assessments and patient reports.'
                                : 'Secure record of your AI assessments and generated reports.'}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center" style={{ marginTop: '4rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <p style={{ marginTop: '1rem' }}>Retrieving Records...</p>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <div className="glass-panel animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-dark)' }}>
                                    <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</th>
                                    {user?.role === 'admin' && (
                                        <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Patient</th>
                                    )}
                                    <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Module</th>
                                    <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Risk Assessment</th>
                                    <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Confidence</th>
                                    <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-glow)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '1.5rem', color: 'var(--text-main)' }}>
                                            {new Date(item.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {new Date(item.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        {user?.role === 'admin' && (
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ fontWeight: '500' }}>{item.user?.username || 'Unknown'}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.user?.email || 'N/A'}</div>
                                            </td>
                                        )}
                                        <td style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{
                                                    width: '8px', height: '8px', borderRadius: '50%',
                                                    background: item.type.toLowerCase() === 'diabetes' ? 'var(--primary)' : 'var(--secondary)'
                                                }}></div>
                                                {item.type.toLowerCase() === 'diabetes' ? 'Diabetes' : 'Cardio'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <span className={`status-badge status-${item.risk_level.toLowerCase()}`}>
                                                {item.risk_level} Risk
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.5rem', fontWeight: '600' }}>
                                            {(item.probability * 100).toFixed(1)}%
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                onClick={() => downloadReport(item._id)}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                </svg>
                                                Report
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={user?.role === 'admin' ? 6 : 5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            <div style={{ marginBottom: '1rem', opacity: 0.5 }}>
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                                </svg>
                                            </div>
                                            {user?.role === 'admin'
                                                ? 'No global diagnostic records found.'
                                                : 'No diagnostic records found. Initiate a new scan from the Dashboard.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default History;
