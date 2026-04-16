import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error("Login Error:", err);
            const errMsg = err.response?.data?.msg || err.message || 'Invalid email or password';
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div className="container" style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '2rem'
            }}>
                {/* Background Blobs Removed for clean medical look */}

                <div className="glass-panel animate-fade-in" style={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: '1000px',
                    minHeight: '600px',
                    overflow: 'hidden',
                    padding: 0
                }}>
                    {/* Left Side - Illustration */}
                    <div style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, var(--bg-glass) 0%, var(--bg-panel) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '3rem',
                        position: 'relative',
                        borderRight: '1px solid var(--border-color)'
                    }} className="hidden-mobile">
                        <div style={{
                            position: 'absolute',
                            top: '2rem',
                            left: '2rem',
                            zIndex: 10
                        }}>
                            <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--primary)' }}>AutoMed <span style={{ color: 'var(--text-main)' }}>AI</span></h1>
                        </div>

                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src="/src/assets/auth-illustration-v2.png"
                                alt="Predict. Prevent. Empower."
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 10px 20px rgba(14, 165, 233, 0.1))' // Softer, cleaner shadow
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div style={{
                        flex: 1,
                        padding: '4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <div className="mb-8">
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Log in</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Welcome back! Please enter your details.</p>
                        </div>

                        {error && (
                            <div style={{
                                background: 'rgba(255, 0, 85, 0.1)',
                                border: '1px solid var(--danger)',
                                color: 'var(--danger)',
                                padding: '1rem',
                                borderRadius: 'var(--radius-sm)',
                                marginBottom: '1.5rem',
                                textAlign: 'center'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        style={{ paddingLeft: '1rem' }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        style={{ paddingLeft: '1rem' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, cursor: 'pointer', textTransform: 'none' }}>
                                    <input type="checkbox" style={{ width: 'auto', margin: 0 }} />
                                    Remember me
                                </label>
                                <Link to="/forgot-password" style={{ color: 'var(--text-muted)' }}>Forgot Password?</Link>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={loading}
                                style={{
                                    padding: '1rem',
                                    fontSize: '1rem',
                                    width: '100%',
                                }}
                            >
                                {loading ? 'Authenticating...' : 'Log in'}
                            </button>
                        </form>

                        <div className="text-center mt-4" style={{ marginTop: '2rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign up</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .hidden-mobile {
                        display: none !important;
                    }
                }
            `}</style>
            <Footer />
        </div>
    );
};

export default Login;
