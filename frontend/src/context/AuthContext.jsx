import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check expiry
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    // Fetch full user details if needed, or just use decoded info
                    setUser({
                        ...decoded,
                        username: localStorage.getItem('username'),
                        role: localStorage.getItem('role')
                    });
                }
            } catch (e) {
                console.error("Invalid token", e);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { access_token, username, role } = res.data;

        localStorage.setItem('token', access_token);
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);

        const decoded = jwtDecode(access_token);
        setUser({ ...decoded, username, role });
        return res.data;
    };

    const register = async (username, email, password) => {
        return await api.post('/auth/register', { username, email, password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
