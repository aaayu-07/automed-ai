import { useState, useEffect } from 'react';
import api from '../services/api';

const CoachSidebar = ({ isOpen, onClose, predictionData }) => {
    const [step, setStep] = useState('intro'); // intro, questionnaire, loading, results
    const [answers, setAnswers] = useState({});
    const [tips, setTips] = useState([]);
    const [error, setError] = useState(null);

    // Reset state when sidebar opens with new data
    useEffect(() => {
        if (isOpen && predictionData) {
            setStep('intro');
            setAnswers({});
            setTips([]);
            setError(null);
        }
    }, [isOpen, predictionData]);

    const questions = {
        Diabetes: [
            { id: 'sugar', label: "How often do you consume sugary beverages or sweets?", type: 'select', options: ['Daily', '3-4 times a week', 'Rarely', 'Never'] },
            { id: 'exercise', label: "How many days per week do you engage in moderate exercise?", type: 'select', options: ['0 days', '1-2 days', '3-5 days', 'Every day'] },
            { id: 'monitoring', label: "Do you monitor your blood glucose levels at home?", type: 'select', options: ['Yes, regularly', 'Occasionally', 'No'] },
            { id: 'sleep', label: "Average daily sleep duration:", type: 'select', options: ['Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours'] },
            { id: 'stress', label: "How would you rate your daily stress levels?", type: 'select', options: ['Low', 'Moderate', 'High', 'Very High'] }
        ],
        Cardio: [
            { id: 'sodium', label: "How often do you eat processed or salty foods?", type: 'select', options: ['Daily', 'Frequently', 'Occasionally', 'Rarely'] },
            { id: 'activity', label: "How would you describe your physical activity level?", type: 'select', options: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'] },
            { id: 'smoking', label: "Do you smoke or use tobacco products?", type: 'select', options: ['Yes', 'Used to, but quit', 'No'] },
            { id: 'bp_check', label: "Do you regularly check your blood pressure?", type: 'select', options: ['Yes', 'No'] },
            { id: 'symptoms', label: "Do you experience shortness of breath during mild activity?", type: 'select', options: ['Often', 'Sometimes', 'Rarely/Never'] }
        ]
    };

    const getQuestions = () => {
        if (!predictionData) return [];
        return questions[predictionData.type] || questions['Diabetes']; // Fallback
    };

    const handleAnswerChange = (qId, value) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const startQuestionnaire = () => {
        setStep('questionnaire');
    };

    const submitQuestionnaire = async () => {
        setStep('loading');
        setError(null);
        try {
            const { risk_level, probability, inputs } = predictionData;

            // Derive some basic factors for context
            const factors = [];
            if (inputs.BMI && inputs.BMI > 25) factors.push("Elevated BMI");
            if (inputs.Glucose && inputs.Glucose > 140) factors.push("High Glucose");
            if (inputs.BloodPressure && inputs.BloodPressure > 80) factors.push("Elevated BP");
            if (inputs.Age && inputs.Age > 50) factors.push("Age Factor");
            if (inputs.Cholesterol && inputs.Cholesterol > 200) factors.push("High Cholesterol");

            const response = await api.post('/coach/generate_tips', {
                risk_level,
                probability: (probability * 100).toFixed(1),
                factors,
                prediction_type: predictionData.type || 'Health',
                lifestyle_responses: answers
            });

            setTips(response.data.tips || []);
            setStep('results');
        } catch (err) {
            console.error(err);
            setError("My systems are temporarily offline. Please try again.");
            setStep('results'); // Show error state
        }
    };

    if (!isOpen) return null;

    const activeQuestions = getQuestions();
    const allAnswered = activeQuestions.every(q => answers[q.id]);

    return (
        <>
            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 9998,
                    backdropFilter: 'blur(2px)'
                }}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className="coach-sidebar glass-panel" style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '400px',
                height: '100vh',
                zIndex: 9999,
                padding: '2rem',
                transform: 'translateX(0)',
                animation: 'slideIn 0.3s ease-out',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid var(--border-color)',
                background: '#FFFFFF'
            }}>
                <style>{`
                    @keyframes slideIn {
                        from { transform: translateX(100%); }
                        to { transform: translateX(0); }
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .tip-card {
                        background: '#F8FAFC';
                        border: 1px solid var(--border-color);
                        border-radius: 12px;
                        padding: 1rem;
                        margin-bottom: 1rem;
                        transition: all 0.3s ease;
                    }
                    .tip-card:hover {
                        background: '#F0F9FF';
                        transform: translateY(-2px);
                        border-color: var(--primary);
                    }
                    .question-group {
                        margin-bottom: 1.5rem;
                        animation: fadeIn 0.5s ease;
                    }
                    .question-label {
                        display: block;
                        margin-bottom: 0.5rem;
                        color: var(--text-muted);
                        font-size: 0.9rem;
                    }
                    .option-btn {
                        display: block;
                        width: 100%;
                        text-align: left;
                        padding: 0.8rem;
                        margin-bottom: 0.5rem;
                        background: '#F8FAFC';
                        border: 1px solid var(--border-color);
                        border-radius: 8px;
                        color: var(--text-main);
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .option-btn:hover {
                        background: '#F0F9FF';
                    }
                    .option-btn.selected {
                        background: '#E0F2FE';
                        border-color: var(--primary);
                        color: var(--primary);
                    }
                `}</style>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '2rem' }}>🤖</span> AI Coach
                    </h2>
                    <button onClick={onClose} style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '1.5rem'
                    }}>&times;</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>

                    {/* STEP 1: INTRO */}
                    {step === 'intro' && (
                        <div className="animate-fade-in">
                            <p style={{ lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                                I've analyzed your clinical biomarkers. To provide truly personalized guidance, I need to understand your daily habits slightly better.
                            </p>
                            <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>🎯 Goal</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    Translate medical risk into actionable lifestyle changes customized for you.
                                </p>
                            </div>
                            <button
                                onClick={startQuestionnaire}
                                className="btn btn-primary w-full"
                                style={{ padding: '1rem' }}
                            >
                                Start Assessment
                            </button>
                        </div>
                    )}

                    {/* STEP 2: QUESTIONNAIRE */}
                    {step === 'questionnaire' && (
                        <div>
                            <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--primary)' }}>
                                {predictionData?.type} Lifestyle Check
                            </p>
                            {activeQuestions.map((q) => (
                                <div key={q.id} className="question-group">
                                    <label className="question-label">{q.label}</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        {q.options.map(opt => (
                                            <button
                                                key={opt}
                                                className={`option-btn ${answers[q.id] === opt ? 'selected' : ''}`}
                                                onClick={() => handleAnswerChange(q.id, opt)}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={submitQuestionnaire}
                                className="btn btn-secondary w-full"
                                style={{ marginTop: '1rem', padding: '1rem' }}
                                disabled={!allAnswered}
                            >
                                Generate Personalized Plan
                            </button>
                        </div>
                    )}

                    {/* STEP 3: LOADING */}
                    {step === 'loading' && (
                        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
                            <div style={{
                                width: '40px', height: '40px',
                                border: '3px solid #E0F2FE',
                                borderTop: '3px solid var(--primary)',
                                borderRadius: '50%',
                                margin: '0 auto 1rem',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <p>Synthesizing biomarkers with lifestyle data...</p>
                            <p style={{ fontSize: '0.8rem' }}>Crafting your custom roadmap</p>
                        </div>
                    )}

                    {/* STEP 4: RESULTS */}
                    {step === 'results' && (
                        <div>
                            {error ? (
                                <div style={{ color: 'var(--danger)', textAlign: 'center', marginTop: '2rem' }}>
                                    {error}
                                    <button
                                        onClick={() => setStep('intro')}
                                        className="btn btn-outline"
                                        style={{ marginTop: '1rem', width: '100%' }}
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : (
                                <div className="animate-fade-in">
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                        Based on your <strong>{predictionData.risk_level}</strong> risk profile and lifestyle inputs, here is your tailored action plan:
                                    </p>

                                    {tips.map((tip, index) => (
                                        <div key={index} className="tip-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                            <div style={{
                                                color: 'var(--primary)',
                                                fontWeight: 'bold',
                                                fontSize: '0.9rem',
                                                marginBottom: '0.5rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            }}>
                                                Action 0{index + 1}
                                            </div>
                                            <p style={{ margin: 0, lineHeight: '1.5' }}>{tip}</p>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => setStep('questionnaire')}
                                        style={{
                                            background: 'none', border: 'none', color: 'var(--text-muted)',
                                            fontSize: '0.85rem', width: '100%', marginTop: '2rem', cursor: 'pointer', textDecoration: 'underline'
                                        }}
                                    >
                                        Update Lifestyle Inputs
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        AutoMed AI Assistant • Powered by Gemini
                    </p>
                </div>
            </div>
        </>
    );
};

export default CoachSidebar;
