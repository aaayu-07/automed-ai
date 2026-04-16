import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import SequenceHero from '../components/SequenceHero';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Make Navbar overlay Sequence hero but still fix it globally or allow it natural flow? It flows fine inside the display container. */}
            <Navbar />

            {/* Scroll-Driven Premium Core Experience */}
            <SequenceHero />

            <div className="container" style={{ marginTop: '5rem', marginBottom: '5rem', flex: 1, position: 'relative', zIndex: 10, background: 'var(--bg-panel)' }}>
                <div className="text-center mb-8 animate-fade-in">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        AutoMed <span style={{ color: 'var(--primary)' }}>OS</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Advanced AI diagnostic systems ready. Select a protocol to begin analysis.
                    </p>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '2rem', marginTop: '3rem' }}>

                    {/* Diabetes Module */}
                    <Link to="/predict/diabetes" className="glass-panel animate-fade-in" style={{
                        padding: '2.5rem',
                        textDecoration: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '300px',
                        transition: 'all 0.4s ease'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-50px',
                            right: '-50px',
                            width: '200px',
                            height: '200px',
                            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%)',
                            borderRadius: '50%'
                        }}></div>

                        <div>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'var(--primary-glow)', // Soft sky blue
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                border: '1px solid var(--border-focus)'
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Diabetes Protocol</h2>
                            <p style={{ color: 'var(--text-muted)' }}>
                                Clinical risk assessment using biological markers (Glucose, Insulin, BMI) powered by Enzyme-RF algorithms.
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '2rem', color: 'var(--primary)', fontWeight: '600' }}>
                            Initialize Scan <span style={{ marginLeft: '10px' }}>&rarr;</span>
                        </div>
                    </Link>

                    {/* Heart Module */}
                    <Link to="/predict/lifestyle" className="glass-panel animate-fade-in" style={{
                        padding: '2.5rem',
                        textDecoration: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '300px',
                        transition: 'all 0.4s ease',
                        animationDelay: '0.1s'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-50px',
                            right: '-50px',
                            width: '200px',
                            height: '200px',
                            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
                            borderRadius: '50%'
                        }}></div>

                        <div>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'var(--secondary-glow)', // Soft mint
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                border: '1px solid rgba(34, 211, 238, 0.3)'
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                                </svg>
                            </div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Cardio Protocol</h2>
                            <p style={{ color: 'var(--text-muted)' }}>
                                Heart failure probability analysis based on physiological data (ECG, Angina, Cholesterol) and deep learning.
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '2rem', color: 'var(--secondary)', fontWeight: '600' }}>
                            Initialize Scan <span style={{ marginLeft: '10px' }}>&rarr;</span>
                        </div>
                    </Link>
                </div>

                {/* History Quick Link */}
                <div className="glass-panel animate-fade-in" style={{
                    marginTop: '2rem',
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    animationDelay: '0.2s',
                    background: 'var(--bg-panel)'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Recent Assessments</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>View your diagnostic history and reports.</p>
                    </div>
                    <Link to="/history" className="btn btn-secondary">
                        Open Archives
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
