import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/authService';
import analyticsService from '../services/analyticsService';
import toast from 'react-hot-toast';
import {
    HiOutlineUserAdd, HiOutlineUserGroup, HiOutlineOfficeBuilding,
    HiOutlineMail, HiOutlinePhone, HiOutlineSearch, HiOutlineX,
    HiOutlineCheck, HiOutlinePencil
} from 'react-icons/hi';
import api from '../services/api';

const StaffManagement = () => {
    const queryClient = useQueryClient();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState('all');
    const [assigningStaff, setAssigningStaff] = useState(null); // staff id being reassigned
    const [newDeptId, setNewDeptId] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        department: '',
    });

    // Fetch staff members
    const { data: staffData, isLoading: staffLoading } = useQuery({
        queryKey: ['staff-members'],
        queryFn: () => authService.getUsers('staff'),
    });

    // Fetch departments
    const { data: deptData, isLoading: deptLoading } = useQuery({
        queryKey: ['departments'],
        queryFn: () => analyticsService.getDepartments(),
    });

    const staff = staffData?.data?.users || [];
    const departments = deptData?.data?.departments || [];

    // Create staff mutation
    const createStaffMutation = useMutation({
        mutationFn: (data) => authService.createStaff(data),
        onSuccess: () => {
            toast.success('Staff member created successfully');
            queryClient.invalidateQueries({ queryKey: ['staff-members'] });
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            setShowCreateForm(false);
            setFormData({ name: '', email: '', password: '', phone: '', department: '' });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to create staff');
        },
    });

    // Assign staff to department mutation
    const assignDeptMutation = useMutation({
        mutationFn: ({ deptId, staffId }) => {
            return api.patch(`/departments/${deptId}/assign-staff`, { staffId });
        },
        onSuccess: () => {
            toast.success('Staff reassigned successfully');
            queryClient.invalidateQueries({ queryKey: ['staff-members'] });
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            setAssigningStaff(null);
            setNewDeptId('');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to reassign staff');
        },
    });

    const handleCreateStaff = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.department) {
            toast.error('Please fill all required fields');
            return;
        }
        createStaffMutation.mutate(formData);
    };

    const handleReassign = (staffId) => {
        if (!newDeptId) {
            toast.error('Please select a department');
            return;
        }
        assignDeptMutation.mutate({ deptId: newDeptId, staffId });
    };

    // Filter staff
    const filteredStaff = staff.filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = selectedDept === 'all' || s.department?._id === selectedDept;
        return matchesSearch && matchesDept;
    });

    // Stats
    const totalStaff = staff.length;
    const activeDepts = departments.length;
    const unassigned = staff.filter((s) => !s.department).length;

    if (staffLoading || deptLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Staff Management</h2>
                    <p className="text-sm text-text-secondary mt-1">Manage staff members and department assignments</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="btn-primary flex items-center gap-2 mt-12"
                >
                    {showCreateForm ? <HiOutlineX className="w-4 h-4" /> : <HiOutlineUserAdd className="w-4 h-4" />}
                    {showCreateForm ? 'Cancel' : 'Add Staff'}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-success-light/50 rounded-lg flex items-center justify-center">
                        <HiOutlineUserGroup className="w-5 h-5 text-success" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-text-primary">{totalStaff}</p>
                        <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Total Staff</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-info-light rounded-lg flex items-center justify-center">
                        <HiOutlineOfficeBuilding className="w-5 h-5 text-info" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-text-primary">{activeDepts}</p>
                        <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Departments</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-warning-light/50 rounded-lg flex items-center justify-center">
                        <HiOutlineUserAdd className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-text-primary">{unassigned}</p>
                        <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Unassigned</p>
                    </div>
                </div>
            </div>

            {/* Create Staff Form */}
            {showCreateForm && (
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-text-primary mb-4">Create New Staff Member</h3>
                    <form onSubmit={handleCreateStaff} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">Full Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input-field"
                                placeholder="Enter full name"
                            />
                        </div>
                        <div>
                            <label className="input-label">Email *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-field"
                                placeholder="staff@example.com"
                            />
                        </div>
                        <div>
                            <label className="input-label">Password *</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input-field"
                                placeholder="Min 6 characters"
                            />
                        </div>
                        <div>
                            <label className="input-label">Phone</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="input-field"
                                placeholder="Phone number"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="input-label">Department *</label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="sm:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={createStaffMutation.isPending}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-neutral-900 hover:bg-black text-white rounded-full shadow-sm hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-premium-hover"
                            >
                                <HiOutlineUserAdd className="w-4 h-4" />
                                {createStaffMutation.isPending ? 'Creating...' : 'Create Staff'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="panel p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-9 w-full"
                        placeholder="Search staff by name or email..."
                    />
                </div>
                <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="input-field sm:w-48"
                >
                    <option value="all">All Departments</option>
                    {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                </select>
            </div>

            {/* Staff List */}
            <div className="panel overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border">
                    <h3 className="text-sm font-bold text-text-primary">
                        Staff Members ({filteredStaff.length})
                    </h3>
                </div>
                <div className="divide-y divide-border">
                    {filteredStaff.length === 0 ? (
                        <div className="p-8 text-center text-text-tertiary text-sm">
                            No staff members found
                        </div>
                    ) : (
                        filteredStaff.map((member) => (
                            <div key={member._id} className="px-5 py-4 flex items-center gap-4 hover:bg-bg-tertiary transition-colors">
                                {/* Avatar */}
                                <div className="w-10 h-10 bg-bg-secondary border border-border rounded-full flex items-center justify-center text-sm font-bold text-text-primary flex-shrink-0">
                                    {member.name?.[0]?.toUpperCase() || '?'}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-text-primary truncate">{member.name}</h4>
                                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                        <span className="text-xs text-text-tertiary flex items-center gap-1">
                                            <HiOutlineMail className="w-3.5 h-3.5" /> {member.email}
                                        </span>
                                        {member.phone && (
                                            <span className="text-xs text-text-tertiary flex items-center gap-1">
                                                <HiOutlinePhone className="w-3.5 h-3.5" /> {member.phone}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Department Badge & Reassign */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {assigningStaff === member._id ? (
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={newDeptId}
                                                onChange={(e) => setNewDeptId(e.target.value)}
                                                className="input-field text-xs py-1.5 w-40"
                                            >
                                                <option value="">Select dept</option>
                                                {departments.map((dept) => (
                                                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => handleReassign(member._id)}
                                                disabled={assignDeptMutation.isPending}
                                                className="w-7 h-7 rounded-md bg-success/15 text-success hover:bg-success/25 flex items-center justify-center transition-colors"
                                            >
                                                <HiOutlineCheck className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => { setAssigningStaff(null); setNewDeptId(''); }}
                                                className="w-7 h-7 rounded-md bg-error/15 text-error hover:bg-error/25 flex items-center justify-center transition-colors"
                                            >
                                                <HiOutlineX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className={`badge text-xs ${member.department
                                                ? 'bg-info-light/15 text-info border border-info-light/20'
                                                : 'bg-warning-light/15 text-warning border border-warning-light/20'
                                                }`}>
                                                {member.department?.name || 'Unassigned'}
                                            </span>
                                            <button
                                                onClick={() => { setAssigningStaff(member._id); setNewDeptId(member.department?._id || ''); }}
                                                className="w-7 h-7 rounded-md bg-bg-secondary border border-border text-text-tertiary hover:text-text-primary hover:border-text-secondary flex items-center justify-center transition-all"
                                                title="Reassign department"
                                            >
                                                <HiOutlinePencil className="w-3.5 h-3.5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffManagement;
