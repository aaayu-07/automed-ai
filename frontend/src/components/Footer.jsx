import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--bg-panel)',
            borderTop: '1px solid var(--border-color)',
            padding: '4rem 0 1.5rem 0',
            marginTop: 'auto'
        }}>
            <div className="container footer-container">
                {/* Left Side */}
                <div className="footer-left">
                    <div style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: 'var(--text-main)',
                        letterSpacing: '-0.03em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        <span style={{ color: 'var(--primary)' }}>AutoMed</span> AI
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        Advanced AI diagnostic systems for proactive healthcare and unified clinical prediction.
                    </p>
                    <div className="social-icons" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                    </div>
                </div>

                {/* Middle Sections */}
                <div className="footer-middle">
                    <div>
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '1.2rem', fontSize: '1.1rem', fontWeight: '600' }}>Product</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <Link to="/dashboard" className="footer-link">Dashboard</Link>
                            <Link to="/predict/diabetes" className="footer-link">Diabetes Prediction</Link>
                            <Link to="/predict/lifestyle" className="footer-link">Cardio Prediction</Link>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '1.2rem', fontSize: '1.1rem', fontWeight: '600' }}>Company</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <Link to="/about" className="footer-link">About</Link>
                            <Link to="/contact" className="footer-link">Contact</Link>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '1.2rem', fontSize: '1.1rem', fontWeight: '600' }}>Legal</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="footer-right">
                    <h4 style={{ color: 'var(--text-main)', marginBottom: '1.2rem', fontSize: '1.1rem', fontWeight: '600' }}>Subscribe</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.2rem', lineHeight: '1.5' }}>
                        Get the latest healthcare insights delivered to your inbox.
                    </p>
                    <form className="subscribe-form" onSubmit={(e) => { e.preventDefault(); e.target.reset(); }}>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Enter your email" 
                            className="subscribe-input"
                            required
                        />
                        <button type="submit" className="subscribe-btn" aria-label="Subscribe">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '0.5rem', borderTop: '1px solid var(--border-color)', marginTop: '3rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    &copy; 2026 AutoMed AI. All rights reserved.
                </p>
            </div>

            <style>{`
                .footer-container {
                    display: flex;
                    justify-content: space-between;
                    gap: 3rem;
                    flex-wrap: wrap;
                }
                .footer-left {
                    flex: 1;
                    min-width: 260px;
                    max-width: 320px;
                }
                .footer-middle {
                    flex: 2;
                    display: flex;
                    gap: 3rem;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    min-width: 320px;
                }
                .footer-right {
                    flex: 1.2;
                    min-width: 280px;
                }
                .social-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background: var(--bg-dark);
                    color: var(--text-muted);
                    transition: all 0.3s ease;
                    border: 1px solid var(--border-color);
                }
                .social-link:hover {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                    transform: translateY(-3px);
                    box-shadow: 0 4px 12px var(--primary-glow);
                }
                .footer-link {
                    color: var(--text-muted);
                    font-size: 0.95rem;
                    transition: color 0.2s ease;
                    text-decoration: none;
                }
                .footer-link:hover {
                    color: var(--primary);
                }
                .subscribe-form {
                    display: flex;
                    gap: 0.8rem;
                    position: relative;
                    max-width: 400px;
                }
                .subscribe-input {
                    flex: 1;
                    border-radius: 99px !important;
                    padding: 0.8rem 1.2rem !important;
                    border: 1px solid var(--border-color) !important;
                    background: var(--bg-dark) !important;
                    font-size: 0.95rem !important;
                    transition: all 0.3s ease !important;
                    width: auto !important;
                }
                .subscribe-input:focus {
                    border-color: var(--primary) !important;
                    box-shadow: 0 0 0 3px var(--primary-glow) !important;
                    background: var(--bg-panel) !important;
                }
                .subscribe-btn {
                    border-radius: 99px;
                    width: 48px;
                    height: 48px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--primary);
                    color: white;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px var(--primary-glow);
                }
                .subscribe-btn:hover {
                    background: #0284c7;
                    transform: translateX(3px);
                    box-shadow: 0 6px 16px var(--primary-glow);
                }

                @media (max-width: 900px) {
                    .footer-container {
                        gap: 2.5rem;
                    }
                    .footer-middle {
                        min-width: 100%;
                        justify-content: flex-start;
                        gap: 4rem;
                        order: 3;
                    }
                    .footer-right {
                        min-width: 100%;
                        order: 2;
                    }
                    .footer-left {
                        min-width: 100%;
                        order: 1;
                    }
                }
                
                @media (max-width: 600px) {
                    .footer-middle {
                        flex-direction: column;
                        gap: 2rem;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
