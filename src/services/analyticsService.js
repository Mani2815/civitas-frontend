import api from './api';

export const analyticsService = {
    getOverview: async () => {
        const res = await api.get('/analytics/overview');
        return res.data;
    },

    getCategoryDistribution: async () => {
        const res = await api.get('/analytics/category-distribution');
        return res.data;
    },

    getStatusDistribution: async () => {
        const res = await api.get('/analytics/status-distribution');
        return res.data;
    },

    getTrends: async (days = 30) => {
        const res = await api.get('/analytics/trends', { params: { days } });
        return res.data;
    },

    getDepartmentPerformance: async () => {
        const res = await api.get('/analytics/departments');
        return res.data;
    },

    getHeatmapData: async () => {
        const res = await api.get('/analytics/heatmap');
        return res.data;
    },

    getDepartments: async () => {
        const res = await api.get('/departments');
        return res.data;
    },
    getCitizenStats: async () => {
        const res = await api.get('/analytics/citizen/stats');
        return res.data;
    },
    getCityStats: async () => {
        const res = await api.get('/analytics/city-stats');
        return res.data;
    },
};

export default analyticsService;
