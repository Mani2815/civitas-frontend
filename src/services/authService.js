import api from './api';

export const authService = {
    login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        return res.data;
    },

    register: async (userData) => {
        const res = await api.post('/auth/register', userData);
        return res.data;
    },

    logout: async () => {
        const res = await api.post('/auth/logout');
        return res.data;
    },

    getCurrentUser: async () => {
        const res = await api.get('/auth/me');
        return res.data;
    },

    getUsers: async (role) => {
        const params = role ? { role } : {};
        const res = await api.get('/auth/users', { params });
        return res.data;
    },

    createStaff: async (userData) => {
        const res = await api.post('/auth/create-staff', userData);
        return res.data;
    },
};

export default authService;
