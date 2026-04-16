import { useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CoachSidebar from '../components/CoachSidebar';
import HealthRoadmap from '../components/HealthRoadmap';

const PredictLifestyle = () => {
    // Default values based on heart_failure.csv dataset
    const [formData, setFormData] = useState({
        Age: 50,
        Sex: 'M',
        ChestPainType: 'ASY',
        RestingBP: 120,
        Cholesterol: 200,
        FastingBS: 0,
        RestingECG: 'Normal',
        MaxHR: 140,
        ExerciseAngina: 'N',
        Oldpeak: 0.0,
        ST_Slope: 'Flat'
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCoachOpen, setIsCoachOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const type = e.target.type;
        const finalValue = type === 'number' ? parseFloat(value) : value;
        setFormData({ ...formData, [name]: finalValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        const minTimePromise = new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const [res] = await Promise.all([
                api.post('/predict/lifestyle', formData),
                minTimePromise
            ]);
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError('Prediction failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ marginTop: '2rem', flex: 1, paddingBottom: '3rem' }}>
                <div className="flex items-center justify-between mb-8 animate-fade-in">
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Cardio <span style={{ color: 'var(--secondary)' }}>Protocol</span></h2>
                        <p style={{ color: 'var(--text-muted)' }}>Advanced heart failure risk analysis using deep physiological data.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '3rem', alignItems: 'start' }}>
                    {/* Input Panel */}
                    <div className="glass-panel animate-fade-in" style={{ padding: '2rem', background: 'var(--bg-panel)' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>

                                <div className="form-group">
                                    <label>Age</label>
                                    <input type="number" name="Age" value={formData.Age} onChange={handleChange} required min="0" max="120" />
                                </div>

                                <div className="form-group">
                                    <label>Sex</label>
                                    <select name="Sex" value={formData.Sex} onChange={handleChange}>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Chest Pain Type</label>
                                    <select name="ChestPainType" value={formData.ChestPainType} onChange={handleChange}>
                                        <option value="TA">Typical Angina</option>
                                        <option value="ATA">Atypical Angina</option>
                                        <option value="NAP">Non-Anginal Pain</option>
                                        <option value="ASY">Asymptomatic</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Resting BP (mm Hg)</label>
                                    <input type="number" name="RestingBP" value={formData.RestingBP} onChange={handleChange} required min="0" />
                                </div>

                                <div className="form-group">
                                    <label>Cholesterol (mm/dl)</label>
                                    <input type="number" name="Cholesterol" value={formData.Cholesterol} onChange={handleChange} required min="0" />
                                </div>

                                <div className="form-group">
                                    <label>Fasting Blood Sugar</label>
                                    <select name="FastingBS" value={formData.FastingBS} onChange={handleChange}>
                                        <option value={0}>Normal (&lt; 120 mg/dl)</option>
                                        <option value={1}>High (&gt; 120 mg/dl)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Resting ECG</label>
                                    <select name="RestingECG" value={formData.RestingECG} onChange={handleChange}>
                                        <option value="Normal">Normal</option>
                                        <option value="ST">ST-T Wave Abnormality</option>
                                        <option value="LVH">Left Ventricular Hypertrophy</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Max Heart Rate</label>
                                    <input type="number" name="MaxHR" value={formData.MaxHR} onChange={handleChange} required min="0" />
                                </div>

                                <div className="form-group">
                                    <label>Exercise Angina</label>
                                    <select name="ExerciseAngina" value={formData.ExerciseAngina} onChange={handleChange}>
                                        <option value="Y">Yes</option>
                                        <option value="N">No</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Oldpeak (ST)</label>
                                    <input type="number" name="Oldpeak" value={formData.Oldpeak} onChange={handleChange} step="0.1" required />
                                </div>

                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>ST Slope</label>
                                    <select name="ST_Slope" value={formData.ST_Slope} onChange={handleChange}>
                                        <option value="Up">Up (Upsloping)</option>
                                        <option value="Flat">Flat</option>
                                        <option value="Down">Down (Downsloping)</option>
                                    </select>
                                </div>

                            </div>
                            <button type="submit" className="btn w-full" style={{
                                marginTop: '2rem',
                                padding: '1rem',
                                fontSize: '1rem',
                                background: 'var(--secondary)',
                                color: '#fff',
                                border: '1px solid transparent',
                                boxShadow: '0 4px 12px var(--secondary-glow)'
                            }} disabled={loading}>
                                {loading ? 'Analyzing Heart Rhythm...' : 'Initiate Cardio Scan'}
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
                        background: loading ? 'var(--secondary-glow)' : 'var(--bg-panel)',
                        animationDelay: '0.2s'
                    }}>
                        {loading ? (
                            <div className="text-center">
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '4px solid var(--accent)',
                                    borderTop: '4px solid var(--secondary)',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                <p style={{ marginTop: '1.5rem', color: 'var(--secondary)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Processing EKG Data...</p>
                            </div>
                        ) : result ? (
                            <div className="text-center w-full animate-fade-in">
                                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem', width: '100%' }}>Cardio Analysis Report</h3>

                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Heart Failure Risk</div>
                                    <div style={{
                                        fontSize: '4rem',
                                        fontWeight: '700',
                                        color: result.risk_level === 'High' ? 'var(--danger)' : result.risk_level === 'Moderate' ? 'var(--warning)' : 'var(--success)',
                                    }}>
                                        {(result.probability * 100).toFixed(1)}%
                                    </div>
                                </div>

                                <div className={`status-badge status-${result.risk_level.toLowerCase()}`} style={{ fontSize: '1.2rem', padding: '0.8rem 2rem' }}>
                                    {result.risk_level} Risk Detected
                                </div>

                                <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    {result.risk_level === 'High'
                                        ? '⚠️ High probability of heart failure detected. Please consult a cardiologist immediately.'
                                        : '✅ Heart function appears normal based on provided parameters.'}
                                </p>

                                {/* HealthLens AI Insights */}
                                {result.healthlens && (
                                    <div style={{
                                        marginTop: '2rem',
                                        padding: '1.5rem',
                                        background: 'var(--secondary-glow)',
                                        border: '1px solid rgba(34, 211, 238, 0.3)',
                                        borderRadius: '12px',
                                        textAlign: 'left',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                    }}>
                                        <h4 style={{ color: 'var(--secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
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
                                        <HealthRoadmap predictionData={{ ...result, inputs: formData, type: 'Cardio' }} />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center" style={{ color: 'var(--text-muted)' }}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                                </svg>
                                <p>Awaiting Cardio Data</p>
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
                predictionData={result ? { ...result, inputs: formData, type: 'Cardio' } : null}
            />
            <Footer />
        </div>
    );
};

export default PredictLifestyle;
