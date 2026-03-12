import api from './api';

export const complaintService = {
    getComplaints: async (params = {}) => {
        const res = await api.get('/complaints', { params });
        return res.data;
    },

    getComplaintById: async (id) => {
        const res = await api.get(`/complaints/${id}`);
        return res.data;
    },

    createComplaint: async (formData) => {
        const res = await api.post('/complaints', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },

    updateStatus: async (id, status, remarks) => {
        const res = await api.patch(`/complaints/${id}/status`, { status, remarks });
        return res.data;
    },

    assignComplaint: async (id, staffId, departmentId) => {
        const res = await api.patch(`/complaints/${id}/assign`, { staffId, departmentId });
        return res.data;
    },

    deleteComplaint: async (id) => {
        const res = await api.delete(`/complaints/${id}`);
        return res.data;
    },

    addComment: async (complaintId, message, isInternal = false) => {
        const res = await api.post(`/complaints/${complaintId}/comments`, { message, isInternal });
        return res.data;
    },

    getComments: async (complaintId) => {
        const res = await api.get(`/complaints/${complaintId}/comments`);
        return res.data;
    },
    
    upvoteComplaint: async (id) => {
        const res = await api.post(`/complaints/${id}/upvote`);
        return res.data;
    },
};

export default complaintService;
