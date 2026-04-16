import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [publications, setPublications] = useState([]);
    const [isPubModalOpen, setIsPubModalOpen] = useState(false);
    const [editingPub, setEditingPub] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        const fetchData = async () => {
            try {
                const statsRes = await api.get('/admin/stats');
                setStats(statsRes.data);

                const usersRes = await api.get('/admin/users');
                setUsers(usersRes.data);

                const pubRes = await api.get('/publications/');
                setPublications(pubRes.data);
            } catch (e) {
                console.error("Failed to fetch admin data", e);
            }
            setLoading(false);
        };

        fetchData();
    }, [user, navigate]);

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
            alert("Failed to download report. It might not be available.");
        }
    };

    const handleDeletePub = async (id) => {
        if (!window.confirm("Are you sure you want to delete this publication?")) return;
        try {
            await api.delete(`/publications/${id}`);
            setPublications(publications.filter(p => p._id !== id));
        } catch (e) {
            console.error("Failed to delete publication", e);
            alert("Failed to delete publication");
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to revoke access for this user?")) return;
        try {
            await api.delete(`/admin/user/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (e) {
            console.error("Failed to revoke user access", e);
            alert("Failed to revoke user access");
        }
    };

    const handleSavePub = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.year = parseInt(data.year);

        try {
            if (editingPub) {
                await api.put(`/publications/${editingPub._id}`, data);
                setPublications(publications.map(p => p._id === editingPub._id ? { ...p, ...data } : p));
            } else {
                const res = await api.post('/publications/', data);
                // Creating a new object to update UI immediately
                const newPub = { ...data, _id: res.data.id, created_at: new Date().toISOString() };
                setPublications([newPub, ...publications].sort((a, b) => b.year - a.year));
            }
            setIsPubModalOpen(false);
            setEditingPub(null);
        } catch (e) {
            console.error("Failed to save publication", e);
            alert("Failed to save publication");
        }
    };

    const openPubModal = (pub = null) => {
        setEditingPub(pub);
        setIsPubModalOpen(true);
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ marginTop: '2rem', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ color: 'var(--text-muted)' }}>Authenicating Admin Access...</div>
            </div>
            <Footer />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ marginTop: '2rem', flex: 1, paddingBottom: '3rem' }}>
                <div className="flex items-center justify-between mb-8 animate-fade-in">
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>System <span style={{ color: 'var(--primary)' }}>Administration</span></h2>
                        <p style={{ color: 'var(--text-muted)' }}>Overview of platform usage and user management.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '20px' }}>
                        <div style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 10px var(--success)' }}></div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>SYSTEM ONLINE</span>
                    </div>
                </div>

                {stats && (
                    <div className="grid grid-cols-2 animate-fade-in" style={{ gap: '2rem', marginBottom: '3rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Platform Metrics</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '1rem' }}>
                                <div className="text-center">
                                    <div style={{ fontSize: '3.5rem', fontWeight: '700', color: 'var(--text-main)' }}>{stats.total_users}</div>
                                    <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Active Users</div>
                                </div>
                                <div style={{ width: '1px', height: '60px', background: 'var(--border-color)' }}></div>
                                <div className="text-center">
                                    <div style={{ fontSize: '3.5rem', fontWeight: '700', color: 'var(--primary)' }}>{stats.total_predictions}</div>
                                    <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Total Scans</div>
                                </div>
                            </div>
                        </div>
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Risk Distribution</h3>
                            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--danger)', fontWeight: '600' }}>High Risk</span>
                                    <div style={{ flex: 1, margin: '0 1rem', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${(stats.risk_breakdown.High / stats.total_predictions) * 100}%`, height: '100%', background: 'var(--danger)' }}></div>
                                    </div>
                                    <span style={{ fontWeight: 'bold' }}>{stats.risk_breakdown.High}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--warning)', fontWeight: '600' }}>Moderate Risk</span>
                                    <div style={{ flex: 1, margin: '0 1rem', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${(stats.risk_breakdown.Moderate / stats.total_predictions) * 100}%`, height: '100%', background: 'var(--warning)' }}></div>
                                    </div>
                                    <span style={{ fontWeight: 'bold' }}>{stats.risk_breakdown.Moderate}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--success)', fontWeight: '600' }}>Low Risk</span>
                                    <div style={{ flex: 1, margin: '0 1rem', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${(stats.risk_breakdown.Low / stats.total_predictions) * 100}%`, height: '100%', background: 'var(--success)' }}></div>
                                    </div>
                                    <span style={{ fontWeight: 'bold' }}>{stats.risk_breakdown.Low}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <h3 className="mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>User Database</h3>
                <div className="glass-panel animate-fade-in" style={{ padding: '0', overflow: 'hidden', animationDelay: '0.2s' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-dark)' }}>
                                <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>User Identity</th>
                                <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</th>
                                <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Access Role</th>
                                <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Privileges</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-glow)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '1.5rem', fontWeight: '500' }}>{u.username}</td>
                                    <td style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>{u.email}</td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            background: u.role === 'admin' ? 'rgba(188, 19, 254, 0.2)' : 'rgba(255,255,255,0.1)',
                                            color: u.role === 'admin' ? 'var(--secondary)' : 'var(--text-muted)',
                                            border: u.role === 'admin' ? '1px solid rgba(188, 19, 254, 0.3)' : '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        {u.role !== 'admin' && (
                                            <button className="btn" style={{
                                                padding: '0.4rem 1rem',
                                                fontSize: '0.8rem',
                                                color: 'var(--danger)',
                                                border: '1px solid rgba(255,0,85,0.3)',
                                                background: 'rgba(255,0,85,0.05)'
                                            }} onClick={() => deleteUser(u._id)}>
                                                Revoke Access
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>



                <div className="flex justify-between items-center mb-4 animate-fade-in" style={{ animationDelay: '0.3s', marginTop: '3rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Publications <span style={{ color: 'var(--primary)' }}>Management</span></h3>
                        <p style={{ color: 'var(--text-muted)' }}>Manage research papers and articles.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => openPubModal()}>
                        + Add Publication
                    </button>
                </div>

                <div className="glass-panel animate-fade-in" style={{ padding: '0', overflow: 'hidden', animationDelay: '0.4s' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-dark)' }}>
                                <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Title</th>
                                <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Authors</th>
                                <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Year</th>
                                <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</th>
                                <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {publications.map((pub) => (
                                <tr key={pub._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-glow)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '1.5rem', fontWeight: '500', maxWidth: '300px' }}>{pub.title}</td>
                                    <td style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>{pub.authors}</td>
                                    <td style={{ padding: '1.5rem' }}>{pub.year}</td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            background: pub.category === 'Research Paper' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(96, 165, 250, 0.2)',
                                            color: pub.category === 'Research Paper' ? '#34d399' : '#60a5fa',
                                        }}>
                                            {pub.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <div className="flex" style={{ gap: '0.5rem' }}>
                                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => openPubModal(pub)}>
                                                Edit
                                            </button>
                                            <button className="btn" style={{
                                                padding: '0.4rem 0.8rem',
                                                color: 'var(--danger)',
                                                border: '1px solid rgba(255,0,85,0.3)',
                                                background: 'rgba(255,0,85,0.05)'
                                            }} onClick={() => handleDeletePub(pub._id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isPubModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 2000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '1rem'
                }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', background: 'var(--bg-panel)' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>{editingPub ? 'Edit Publication' : 'Add New Publication'}</h2>
                        <form onSubmit={handleSavePub}>
                            <div className="grid" style={{ gap: '1rem' }}>
                                <div>
                                    <label>Title</label>
                                    <input name="title" defaultValue={editingPub?.title} required />
                                </div>
                                <div>
                                    <label>Authors</label>
                                    <input name="authors" defaultValue={editingPub?.authors} required />
                                </div>
                                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                    <div>
                                        <label>Year</label>
                                        <input name="year" type="number" defaultValue={editingPub?.year || new Date().getFullYear()} required />
                                    </div>
                                    <div>
                                        <label>Category</label>
                                        <select name="category" defaultValue={editingPub?.category || 'Research Paper'}>
                                            <option value="Research Paper">Research Paper</option>
                                            <option value="Article">Article</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label>Link (URL)</label>
                                    <input name="link" type="url" defaultValue={editingPub?.link} required />
                                </div>
                                <div>
                                    <label>Description/Abstract</label>
                                    <textarea name="description" rows="4" defaultValue={editingPub?.description} required></textarea>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsPubModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingPub ? 'Save Changes' : 'Add Publication'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default AdminDashboard;
