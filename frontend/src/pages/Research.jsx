import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Research() {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPublications();
    }, []);

    const fetchPublications = async () => {
        try {
            const response = await api.get('/publications/');
            setPublications(response.data);
        } catch (error) {
            console.error("Error fetching publications:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ marginTop: '2rem', flex: 1, paddingBottom: '3rem' }}>
                <div className="flex items-center justify-between mb-8 animate-fade-in">
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Research & <span style={{ color: 'var(--primary)' }}>Publications</span></h2>
                        <p style={{ color: 'var(--text-muted)' }}>Explore our latest research papers and articles on AI in lifestyle disease management.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center" style={{ marginTop: '4rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <p style={{ marginTop: '1rem' }}>Loading Research...</p>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <div className="grid animate-fade-in" style={{ gap: '2rem', animationDelay: '0.2s' }}>
                        {publications.map((pub) => (
                            <div key={pub._id} className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ flex: 1, minWidth: '300px' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            backgroundColor: pub.category === 'Research Paper' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(96, 165, 250, 0.1)',
                                            color: pub.category === 'Research Paper' ? '#34d399' : '#60a5fa',
                                            border: pub.category === 'Research Paper' ? '1px solid rgba(52, 211, 153, 0.2)' : '1px solid rgba(96, 165, 250, 0.2)',
                                            marginBottom: '1rem'
                                        }}>
                                            {pub.category}
                                        </span>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                                            {pub.title}
                                        </h2>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                            By <span style={{ color: 'var(--text-main)' }}>{pub.authors}</span> • {pub.year}
                                        </p>
                                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '800px' }}>
                                            {pub.description}
                                        </p>
                                    </div>
                                    <a
                                        href={pub.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            padding: '0.75rem 1.5rem',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Read Paper <span style={{ marginLeft: '0.5rem' }}>↗</span>
                                    </a>
                                </div>
                            </div>
                        ))}

                        {publications.length === 0 && (
                            <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                <div style={{ marginBottom: '1rem', opacity: 0.5 }}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                    </svg>
                                </div>
                                No publications found at the moment.
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Research;
