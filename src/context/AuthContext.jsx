import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from token on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await authService.getCurrentUser();
                    setUser(res.data.user);
                } catch {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = useCallback(async (email, password) => {
        const res = await authService.login(email, password);
        const { user: userData, token } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    }, []);

    const register = useCallback(async (userData) => {
        const res = await authService.register(userData);
        const { user: newUser, token } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        return newUser;
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch {
            // Ignore server-side logout errors
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }, []);

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStaff: user?.role === 'staff',
        isCitizen: user?.role === 'citizen',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
