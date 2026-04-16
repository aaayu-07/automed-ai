import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={{
            position: 'sticky',
            top: '0',
            zIndex: 1000,
            backdropFilter: 'blur(20px)',
            background: 'var(--bg-glass)', /* Updated to new frosted white */
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 0'
        }}>
            <div className="container flex justify-between items-center">
                <Link to="/" style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    letterSpacing: '-0.03em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span style={{
                        color: 'var(--primary)',
                        // Removed aggressive text shadow for clean clinical look
                    }}>AutoMed</span> AI
                </Link>

                <div className="flex items-center" style={{ gap: '2rem' }}>
                    {user ? (
                        <>
                            <div className="flex" style={{ gap: '1.5rem' }}>
                                <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
                                <NavLink to="/research" active={isActive('/research')}>Research</NavLink>
                                <NavLink to="/history" active={isActive('/history')}>History</NavLink>
                                {user.role === 'admin' && <NavLink to="/admin" active={isActive('/admin')}>Admin</NavLink>}
                                <NavLink to="/about" active={isActive('/about')}>About</NavLink>
                                <NavLink to="/contact" active={isActive('/contact')}>Contact</NavLink>
                                <NavLink to="/privacy" active={isActive('/privacy')}>Privacy</NavLink>
                            </div>

                            <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>

                            <div className="flex items-center" style={{ gap: '1rem' }}>
                                <ThemeToggle />
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {user.username}
                                </span>
                                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center" style={{ gap: '1rem' }}>
                            <ThemeToggle />
                            <Link to="/login" style={{ color: 'var(--text-main)', fontWeight: '600' }}>Log in</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '12px' }}>
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link to={to} style={{
        color: active ? 'var(--primary)' : 'var(--text-muted)',
        fontWeight: '500',
        position: 'relative',
        transition: 'color 0.3s'
    }}>
        {children}
        {active && (
            <span style={{
                position: 'absolute',
                bottom: '-4px',
                left: '0',
                width: '100%',
                height: '2px',
                background: 'var(--primary)',
                // Removed aggressive box shadow on active indicator
                borderRadius: '2px'
            }} />
        )}
    </Link>
);

export default Navbar;
