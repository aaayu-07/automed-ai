import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                background: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(14, 165, 233, 0.08)',
                color: isDark ? '#93C5FD' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                flexShrink: 0,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            <span style={{
                display: 'inline-block',
                transition: 'transform 0.4s ease, opacity 0.3s ease',
                transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)',
                fontSize: '16px',
                lineHeight: 1,
            }}>
                {isDark ? '☀️' : '🌙'}
            </span>
        </button>
    );
};

export default ThemeToggle;
