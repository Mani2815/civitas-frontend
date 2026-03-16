import api from './api';

const userService = {
    /**
     * Get current user profile
     * @returns {Promise<Object>} User data
     */
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    /**
     * Update current user profile
     * @param {Object} data - Profile data (name, phone)
     * @returns {Promise<Object>} Updated user data
     */
    updateProfile: async (data) => {
        const response = await api.put('/users/profile', data);
        return response.data;
    }
};

export default userService;
