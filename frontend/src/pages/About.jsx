import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div className="container flex-1" style={{ marginTop: '2rem', marginBottom: '5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                
                {/* Hero */}
                <div style={{ textAlign: 'center', margin: '4rem 0' }} className="animate-fade-in">
                    <h1 style={{ fontSize: '3.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
                        About <span style={{ color: 'var(--primary)' }}>AutoMed AI</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                        Pioneering the future of preventive healthcare through advanced analytics and predictive AI modeling.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-2 animate-fade-in" style={{ gap: '3rem', animationDelay: '0.1s' }}>
                    <div className="glass-panel" style={{ padding: '3rem' }}>
                        <div style={{ width: '50px', height: '50px', background: 'var(--primary-glow)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        </div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Our Mission</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                            AutoMed AI was founded on the belief that healthcare should be proactive, not reactive. 
                            Our mission is to empower practitioners and individuals with highly accurate, AI-driven risk 
                            assessments for debilitating lifestyle diseases like Diabetes and cardiovascular conditions. 
                            By identifying risks early, we enable timely lifestyle interventions.
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '3rem' }}>
                        <div style={{ width: '50px', height: '50px', background: 'var(--secondary-glow)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--secondary)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        </div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>How It Works</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                            Our proprietary engine ingests clinical biomarkers and physiological data from health records. 
                            Using sophisticated ensemble methods, specifically tuned Random Forests and Deep Learning neural 
                            networks, the system analyzes hundreds of latent variables to output a robust probability score 
                            reflecting a patient's risk profile.
                        </p>
                    </div>
                </div>

                {/* Tech Stack & Why It Matters */}
                <div className="glass-panel animate-fade-in" style={{ padding: '4rem', marginTop: '1rem', animationDelay: '0.2s', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)', textAlign: 'center' }}>Technology Stack</h2>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                            <span className="status-badge" style={{ background: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '1rem', padding: '0.8rem 1.5rem' }}>React (Vite)</span>
                            <span className="status-badge" style={{ background: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '1rem', padding: '0.8rem 1.5rem' }}>Tailwind CSS</span>
                            <span className="status-badge" style={{ background: 'var(--bg-dark)', color: 'var(--primary)', border: '1px solid var(--primary-glow)', fontSize: '1rem', padding: '0.8rem 1.5rem' }}>Python / Flask</span>
                            <span className="status-badge" style={{ background: 'var(--bg-dark)', color: 'var(--secondary)', border: '1px solid var(--secondary-glow)', fontSize: '1rem', padding: '0.8rem 1.5rem' }}>Scikit-Learn</span>
                            <span className="status-badge" style={{ background: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '1rem', padding: '0.8rem 1.5rem' }}>SQLite</span>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--border-color)', width: '100%' }}></div>

                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Why It Matters</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7', maxWidth: '800px' }}>
                            Globally, non-communicable lifestyle diseases account for over 70% of early deaths. The burden on healthcare systems is enormous, yet many of these conditions are preventable if caught in the pre-disease phase. AutoMed AI bridges the gap between complex health data and actionable clinical insights, standardizing predictive care and improving patient outcomes worldwide.
                        </p>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default About;
