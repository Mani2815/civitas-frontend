import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import complaintService from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import { STATUS_COLORS, PRIORITY_LEVEL_COLORS, CATEGORY_ICONS, STATUSES } from '../utils/constants';
import { formatRelativeTime, truncateText } from '../utils/formatters';
import { HiOutlineClipboardList, HiOutlineClock, HiOutlineCheckCircle, HiOutlineExclamation } from 'react-icons/hi';
import { ArrowBigUp } from 'lucide-react';
import toast from 'react-hot-toast';

const StaffDashboard = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['staff-complaints', statusFilter],
        queryFn: () => complaintService.getComplaints({ status: statusFilter || undefined }),
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status, remarks }) => complaintService.updateStatus(id, status, remarks),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff-complaints'] });
            toast.success('Status updated');
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
    });

    const complaints = data?.data?.complaints || [];

    const stats = {
        total: complaints.length,
        pending: complaints.filter((c) => c.status === 'Pending').length,
        inProgress: complaints.filter((c) => c.status === 'In Progress').length,
        resolved: complaints.filter((c) => c.status === 'Resolved').length,
    };

    const handleQuickStatus = (id, newStatus) => {
        statusMutation.mutate({ id, status: newStatus, remarks: `Status changed to ${newStatus}` });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-civic-green border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-text-primary">My Assignments</h2>
                <p className="text-sm text-text-secondary mt-1">Manage complaints assigned to you</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-info-light rounded-lg flex items-center justify-center">
                            <HiOutlineClipboardList className="w-5 h-5 text-info" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                            <p className="text-xs text-text-tertiary uppercase tracking-wider font-semibold mt-0.5">Assigned</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-warning-light/50 rounded-lg flex items-center justify-center">
                            <HiOutlineExclamation className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                            <p className="text-xs text-text-tertiary uppercase tracking-wider font-semibold mt-0.5">Pending</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-info-light rounded-lg flex items-center justify-center">
                            <HiOutlineClock className="w-5 h-5 text-info" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-info">{stats.inProgress}</p>
                            <p className="text-xs text-text-tertiary uppercase tracking-wider font-semibold mt-0.5">In Progress</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success-light/50 rounded-lg flex items-center justify-center">
                            <HiOutlineCheckCircle className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-success">{stats.resolved}</p>
                            <p className="text-xs text-text-tertiary uppercase tracking-wider font-semibold mt-0.5">Resolved</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter & Complaints */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setStatusFilter('')}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] focus:outline-none transition-all duration-200 active:scale-95 ${!statusFilter ? 'bg-neutral-900 border-neutral-900 text-white shadow-md scale-[1.02] btn-premium-hover' : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 hover:shadow-md'
                        }`}
                >
                    All
                </button>
                {STATUSES.map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 rounded-full border text-sm font-semibold shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] focus:outline-none transition-all duration-200 active:scale-95 ${statusFilter === s ? 'bg-neutral-900 border-neutral-900 text-white shadow-md scale-[1.02] btn-premium-hover' : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 hover:shadow-md'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {complaints.length === 0 ? (
                <div className="card text-center p-12">
                    <p className="text-text-tertiary">No complaints assigned to you</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {complaints.map((complaint) => (
                        <div key={complaint._id} className="card p-5 card-hover">
                            <div className="flex items-start justify-between gap-4">
                                <Link to={`/staff/complaints/${complaint._id}`} className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        {(() => { const cat = CATEGORY_ICONS[complaint.category]; if (!cat) return null; const { icon: Icon, className, bgClassName } = cat; return <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${bgClassName}`}><Icon className={`w-4 h-4 ${className}`} /></span>; })()}
                                        <h3 className="text-sm font-bold text-text-primary truncate">
                                            {complaint.title}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-text-secondary mb-3">{truncateText(complaint.description, 100)}</p>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className={`badge ${STATUS_COLORS[complaint.status]}`}>{complaint.status}</span>
                                        <span className={`badge ${PRIORITY_LEVEL_COLORS[complaint.priorityLevel]}`}>{complaint.priorityLevel}</span>
                                        <span className="text-xs text-text-tertiary">{formatRelativeTime(complaint.createdAt)}</span>
                                        {complaint.slaBreach && (
                                            <span className="badge bg-error/20 text-error border border-error/20">SLA BREACH</span>
                                        )}
                                    </div>
                                </Link>

                                {/* Quick Actions */}
                                <div className="flex flex-col gap-1.5 flex-shrink-0">
                                    {['Pending', 'Acknowledged'].includes(complaint.status) && (
                                        <button
                                            onClick={() => handleQuickStatus(complaint._id, 'Rejected')}
                                            className="px-3 py-1.5 bg-error/10 text-error text-xs font-medium rounded-lg border border-error/20 hover:bg-error/20 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    )}
                                    {complaint.status === 'Pending' && (
                                        <button
                                            onClick={() => handleQuickStatus(complaint._id, 'Acknowledged')}
                                            className="px-3 py-1.5 bg-secondary-purple/10 text-secondary-purple text-xs font-medium rounded-lg border border-secondary-purple/20 hover:bg-secondary-purple/20 transition-colors"
                                        >
                                            Acknowledge
                                        </button>
                                    )}
                                    {complaint.status === 'Acknowledged' && (
                                        <button
                                            onClick={() => handleQuickStatus(complaint._id, 'In Progress')}
                                            className="px-3 py-1.5 bg-info/10 text-info text-xs font-medium rounded-lg border border-info/20 hover:bg-info/20 transition-colors"
                                        >
                                            Start Work
                                        </button>
                                    )}
                                    {complaint.status === 'In Progress' && (
                                        <button
                                            onClick={() => handleQuickStatus(complaint._id, 'Resolved')}
                                            className="px-3 py-1.5 bg-success/10 text-success text-xs font-medium rounded-lg border border-success/20 hover:bg-success/20 transition-colors"
                                        >
                                            Resolve
                                        </button>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-[#1A1A1B] text-white px-2 py-0.5 rounded-md border border-neutral-700">
                                            <ArrowBigUp className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                                            <span className="text-xs font-bold">{complaint.upvotes || 0}</span>
                                        </div>
                                        <span className="text-sm font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                                            P:{complaint.priorityScore}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;
