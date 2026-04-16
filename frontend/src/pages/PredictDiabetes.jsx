import { useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CoachSidebar from '../components/CoachSidebar';
import HealthRoadmap from '../components/HealthRoadmap';

const PredictDiabetes = () => {
    const [formData, setFormData] = useState({
        Pregnancies: 0,
        Glucose: 120,
        BloodPressure: 70,
        SkinThickness: 20,
        Insulin: 79,
        BMI: 25.0,
        DiabetesPedigreeFunction: 0.5,
        Age: 33
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCoachOpen, setIsCoachOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null); // Reset result to show loading state effectively

        // Simulate a slight delay for the "AI feel" if response is too fast
        const minTimePromise = new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const [res] = await Promise.all([
                api.post('/predict/diabetes', formData),
                minTimePromise
            ]);
            setResult(res.data);
        } catch (err) {
            setError('Prediction failed. Please check your inputs and try again.');
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ marginTop: '2rem', flex: 1, paddingBottom: '3rem' }}>
                <div className="flex items-center justify-between mb-8 animate-fade-in">
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Diabetes <span style={{ color: 'var(--primary)' }}>Protocol</span></h2>
                        <p style={{ color: 'var(--text-muted)' }}>Enter clinical biomarkers for enzymatic risk analysis.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '3rem', alignItems: 'start' }}>
                    {/* Input Panel */}
                    <div className="glass-panel animate-fade-in" style={{ padding: '2rem', background: 'var(--bg-panel)' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                                {Object.keys(formData).map(key => (
                                    <div className="form-group" key={key}>
                                        <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                        <input
                                            type="number"
                                            name={key}
                                            value={formData[key]}
                                            onChange={handleChange}
                                            step="any"
                                            required
                                            style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)' }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = 'var(--primary)';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.15)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = 'var(--border-color)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '2rem', padding: '1rem', fontSize: '1rem' }} disabled={loading}>
                                {loading ? 'Processing Bio-Data...' : 'Initiate Analysis'}
                            </button>
                        </form>
                    </div>

                    {/* Result Panel */}
                    <div className="glass-panel animate-fade-in" style={{
                        padding: '2rem',
                        minHeight: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        background: loading ? 'var(--primary-glow)' : 'var(--bg-panel)',
                        animationDelay: '0.2s'
                    }}>
                        {loading ? (
                            <div className="text-center">
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '4px solid var(--accent)',
                                    borderTop: '4px solid var(--primary)',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                <p style={{ marginTop: '1.5rem', color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Running Algorithms...</p>
                            </div>
                        ) : result ? (
                            <div className="text-center w-full animate-fade-in">
                                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem', width: '100%' }}>Analysis Report</h3>

                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Risk Probability</div>
                                    <div style={{
                                        fontSize: '4rem',
                                        fontWeight: '700',
                                        color: result.risk_level === 'High' ? 'var(--danger)' : result.risk_level === 'Moderate' ? 'var(--warning)' : 'var(--success)'
                                    }}>
                                        {(result.probability * 100).toFixed(1)}%
                                    </div>
                                </div>

                                <div className={`status-badge status-${result.risk_level.toLowerCase()}`} style={{ fontSize: '1.2rem', padding: '0.8rem 2rem' }}>
                                    {result.risk_level} Risk Detected
                                </div>

                                <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    {result.risk_level === 'High'
                                        ? '⚠️ Critical indicators found. Professional medical consultation is highly recommended immediately.'
                                        : '✅ Biomarkers appear within acceptable ranges. Maintain healthy lifestyle habits.'}
                                </p>

                                {/* HealthLens AI Insights */}
                                {result.healthlens && (
                                    <div style={{
                                        marginTop: '2rem',
                                        padding: '1.5rem',
                                        background: 'var(--primary-glow)',
                                        border: '1px solid var(--border-focus)',
                                        borderRadius: '12px',
                                        textAlign: 'left',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                    }}>
                                        <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                            </svg>
                                            HealthLens AI Analysis
                                        </h4>
                                        <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                                            {result.healthlens.explanation}
                                        </p>
                                        {result.healthlens.key_factors && result.healthlens.key_factors.length > 0 && (
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Dominant Risk Factors</div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                    {result.healthlens.key_factors.map((factor, idx) => (
                                                        <span key={idx} style={{
                                                            background: 'rgba(255, 0, 85, 0.1)',
                                                            color: 'var(--danger)',
                                                            padding: '4px 12px',
                                                            borderRadius: '20px',
                                                            fontSize: '0.85rem',
                                                            border: '1px solid rgba(255, 0, 85, 0.3)'
                                                        }}>
                                                            {factor}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* RiskFlow Engine Insights */}
                                {result.riskflow && result.riskflow.trend && (
                                    <div style={{
                                        marginTop: '1.5rem',
                                        padding: '1.5rem',
                                        background: result.riskflow.trend === 'improving' ? 'rgba(0, 255, 157, 0.05)' : result.riskflow.trend === 'worsening' ? 'rgba(255, 0, 85, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                                        border: `1px solid ${result.riskflow.trend === 'improving' ? 'rgba(0, 255, 157, 0.2)' : result.riskflow.trend === 'worsening' ? 'rgba(255, 0, 85, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`,
                                        borderRadius: '12px',
                                        textAlign: 'left',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}>
                                        <h4 style={{
                                            color: result.riskflow.trend === 'improving' ? 'var(--success)' : result.riskflow.trend === 'worsening' ? 'var(--danger)' : 'var(--text-main)',
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '1.1rem'
                                        }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                            </svg>
                                            Risk Trend: <span style={{ textTransform: 'capitalize' }}>{result.riskflow.trend}</span>
                                        </h4>
                                        <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                            {result.riskflow.message}
                                        </p>
                                    </div>
                                )}

                                {/* AI Coach Integration */}
                                <button
                                    onClick={() => setIsCoachOpen(true)}
                                    className="btn btn-secondary animate-pulse"
                                    style={{
                                        marginTop: '2rem',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        fontSize: '1.1rem',
                                        padding: '1rem'
                                    }}
                                >
                                    <span>🤖</span> Chat with AI Health Coach
                                </button>

                                {/* Preventive Roadmap */}
                                {(result.risk_level === 'Moderate' || result.risk_level === 'High') && (
                                    <div style={{ marginTop: '3rem', width: '100%' }}>
                                        <HealthRoadmap predictionData={{ ...result, inputs: formData, type: 'Diabetes' }} />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center" style={{ color: 'var(--text-muted)' }}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                                    <path d="M12 2v20M2 12h20M7 8l-4 4 4 4M17 16l4-4-4-4" />
                                </svg>
                                <p>Awaiting Data Input</p>
                            </div>
                        )}
                        {error && <p style={{ color: 'var(--danger)', marginTop: '1rem' }}>{error}</p>}
                    </div>
                </div>
            </div>

            {/* Sidebar Component */}
            <CoachSidebar
                isOpen={isCoachOpen}
                onClose={() => setIsCoachOpen(false)}
                predictionData={result ? { ...result, inputs: formData, type: 'Diabetes' } : null}
            />
            <Footer />
        </div >
    );
};

export default PredictDiabetes;
