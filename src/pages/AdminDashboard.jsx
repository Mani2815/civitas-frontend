import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import complaintService from '../services/complaintService';
import analyticsService from '../services/analyticsService';
import authService from '../services/authService';
import { PRIORITY_LEVEL_COLORS, CATEGORY_ICONS, CHART_COLORS, STATUS_CHART_COLORS } from '../utils/constants';
import { formatRelativeTime, formatDuration } from '../utils/formatters';
import { HiOutlineChartBar, HiOutlineClock, HiOutlineShieldCheck, HiOutlineExclamationCircle, HiOutlineUserGroup, HiOutlineFilter, HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import Button from '../components/Button';

const AdminDashboard = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('overview');

    // Queries
    const { data: overviewData } = useQuery({
        queryKey: ['analytics-overview'],
        queryFn: () => analyticsService.getOverview(),
    });

    const { data: categoryData } = useQuery({
        queryKey: ['analytics-categories'],
        queryFn: () => analyticsService.getCategoryDistribution(),
    });

    const { data: statusData } = useQuery({
        queryKey: ['analytics-status'],
        queryFn: () => analyticsService.getStatusDistribution(),
    });

    const { data: trendData } = useQuery({
        queryKey: ['analytics-trends'],
        queryFn: () => analyticsService.getTrends(30),
    });

    const { data: deptData } = useQuery({
        queryKey: ['analytics-departments'],
        queryFn: () => analyticsService.getDepartmentPerformance(),
    });

    const { data: complaintsData } = useQuery({
        queryKey: ['admin-complaints'],
        queryFn: () => complaintService.getComplaints({ limit: 50, sort: '-priorityScore' }),
    });

    const { data: staffData } = useQuery({
        queryKey: ['staff-list'],
        queryFn: () => authService.getUsers('staff'),
    });

    const assignMutation = useMutation({
        mutationFn: ({ id, staffId }) => complaintService.assignComplaint(id, staffId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-complaints'] });
            toast.success('Complaint assigned');
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Assignment failed'),
    });

    const downloadReport = (data, filename) => {
        if (!data || !data.length) {
            toast.error('No tabular data to export in this view');
            return;
        }
        const headers = Object.keys(data[0]).join(',');
        const csv = [
            headers,
            ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Report downloaded successfully');
    };

    const overview = overviewData?.data || {};
    const categories = categoryData?.data || [];
    const statuses = statusData?.data || [];
    const trends = trendData?.data || [];
    const departments = deptData?.data || [];
    const complaints = complaintsData?.data?.complaints || [];
    const staffList = staffData?.data?.users || [];

    const [assigningId, setAssigningId] = useState(null);

    const handleAssign = (complaintId, staffId) => {
        assignMutation.mutate({ id: complaintId, staffId });
        setAssigningId(null);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-bg-secondary border border-border p-3 rounded-lg shadow-xl">
                <p className="text-xs font-bold text-text-tertiary mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} className="text-xs text-text-tertiary">
                        {p.name}: <span className="font-bold text-text-primary">{p.value}</span>
                    </p>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Analytics Dashboard</h2>
                    <p className="text-sm text-text-secondary mt-1">Real-time monitoring of city infrastructure</p>
                </div>
            </div>

            {/* Tab Nav */}
            <div className="border-b border-border">
                <nav className="-mb-px flex gap-6 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'complaints', label: 'Live Feed' },
                        { id: 'departments', label: 'Performance' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-primary text-primary-light'
                                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-text-secondary'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Complaints"
                            value={overview.totalComplaints || 0}
                            icon={HiOutlineChartBar}
                            color="blue"
                            trend="up"
                            trendValue="12%"
                        />
                        <StatCard
                            title="Avg Resolution"
                            value={formatDuration(overview.avgResolutionTime)}
                            icon={HiOutlineClock}
                            color="primary"
                        />
                        <StatCard
                            title="SLA Breaches"
                            value={overview.slaBreachCount || 0}
                            icon={HiOutlineExclamationCircle}
                            color="red"
                            trend="down"
                            trendValue="5%"
                        />
                        <StatCard
                            title="Active Staff"
                            value={staffList.length}
                            icon={HiOutlineUserGroup}
                            color="purple"
                        />
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="text-center p-4">
                            <p className="text-3xl font-bold text-text-primary">{overview.dailyComplaints || 0}</p>
                            <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mt-1">Today's Volume</p>
                        </Card>
                        <Card className="text-center p-4">
                            <p className="text-3xl font-bold text-text-primary">{overview.weeklyComplaints || 0}</p>
                            <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mt-1">Weekly Volume</p>
                        </Card>
                        <Card className="text-center p-4 border-l-4 border-l-accent-light">
                            <p className="text-3xl font-bold text-accent-light">{overview.backlogCount || 0}</p>
                            <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mt-1">Pending Backlog</p>
                        </Card>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Status Distribution */}
                        <Card>
                            <h3 className="text-sm font-bold text-text-tertiary mb-6 uppercase tracking-wider">Status Distribution</h3>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={statuses} barCategoryGap={20}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: '#475569' }} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {statuses.map((entry, i) => (
                                            <Cell key={i} fill={STATUS_CHART_COLORS[entry.name] || CHART_COLORS[i]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>

                        {/* Category Distribution */}
                        <Card>
                            <h3 className="text-sm font-bold text-text-tertiary mb-6 uppercase tracking-wider">Complaints by Category</h3>
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={categories}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        innerRadius={60}
                                        dataKey="value"
                                        nameKey="name"
                                        stroke="#1e293b"
                                        strokeWidth={2}
                                    >
                                        {categories.map((_, i) => (
                                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                                        iconType="circle"
                                        iconSize={8}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>

                    {/* Trend Line */}
                    <Card>
                        <h3 className="text-sm font-bold text-text-tertiary mb-6 uppercase tracking-wider">30-Day Activity Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    axisLine={{ stroke: '#475569' }}
                                    tickLine={false}
                                    tickFormatter={(val) => val?.slice(5)}
                                />
                                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                                <Line type="monotone" dataKey="filed" stroke="#3b82f6" strokeWidth={2} dot={false} name="Filed" activeDot={{ r: 4, strokeWidth: 0 }} />
                                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={false} name="Resolved" activeDot={{ r: 4, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            )}

            {/* Complaints Tab */}
            {activeTab === 'complaints' && (
                <Card className="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-bg-secondary">
                                    <th className="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider">Category</th>
                                    <th className="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider">Issue</th>
                                    <th className="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider">Priority</th>
                                    <th className="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider">Assigned To</th>
                                    <th className="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {complaints.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-text-secondary text-sm">No active complaints found</td>
                                    </tr>
                                ) : (
                                    complaints.map((complaint) => (
                                        <tr key={complaint._id} className="hover:bg-bg-tertiary transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    {(() => { const cat = CATEGORY_ICONS[complaint.category]; if (!cat) return null; const { icon: Icon, className, bgClassName } = cat; return <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${bgClassName}`}><Icon className={`w-4 h-4 ${className}`} /></span>; })()}
                                                    <span className="text-sm font-medium text-text-tertiary">{complaint.category}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <Link to={`/admin/complaints/${complaint._id}`} className="block group">
                                                    <p className="text-sm font-bold text-text-primary group-hover:text-primary-light transition-colors truncate max-w-[200px]">{complaint.title}</p>
                                                    <p className="text-xs text-text-secondary mt-0.5">#{complaint._id.slice(-6).toUpperCase()}</p>
                                                </Link>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border
                                                    ${complaint.status === 'Resolved' ? 'bg-success/10 text-success border-success/20' :
                                                        complaint.status === 'Pending' ? 'bg-warning/10 text-warning border-warning/20' :
                                                            complaint.status === 'In Progress' ? 'bg-info/10 text-info border-info/20' :
                                                                'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                                                    }
                                                 `}>
                                                    {complaint.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`text-xs font-bold uppercase
                                                        ${complaint.priorityLevel === 'Critical' ? 'text-error' :
                                                            complaint.priorityLevel === 'High' ? 'text-warning' :
                                                                complaint.priorityLevel === 'Medium' ? 'text-info' : 'text-text-tertiary'
                                                        }
                                                    `}>
                                                        {complaint.priorityLevel}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20 w-fit">
                                                        P:{complaint.priorityScore}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {complaint.assignedTo ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-bg-tertiary flex items-center justify-center text-xs font-bold text-text-tertiary">
                                                            {complaint.assignedTo.name[0]}
                                                        </div>
                                                        <span className="text-sm text-text-tertiary">{complaint.assignedTo.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-text-secondary italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="relative inline-block">
                                                    <button
                                                        onClick={() => setAssigningId(assigningId === complaint._id ? null : complaint._id)}
                                                        className="text-xs font-medium text-primary-light hover:text-text-primary transition-colors"
                                                    >
                                                        Assign
                                                    </button>
                                                    {assigningId === complaint._id && (
                                                        <div className="absolute right-0 top-8 z-20 bg-bg-secondary border border-border rounded-lg shadow-xl p-1 min-w-[180px]">
                                                            {staffList.map((staff) => (
                                                                <button
                                                                    key={staff._id}
                                                                    onClick={() => handleAssign(complaint._id, staff._id)}
                                                                    className="w-full text-left px-3 py-2 text-xs text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary rounded-md transition-colors"
                                                                >
                                                                    {staff.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Departments Tab */}
            {activeTab === 'departments' && (
                <Card className="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-bg-secondary">
                                    <th className="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider">Department</th>
                                    <th className="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Total Cases</th>
                                    <th className="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Resolved</th>
                                    <th className="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Pending</th>
                                    <th className="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Efficiency</th>
                                    <th className="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Avg Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {departments.map((dept, i) => (
                                    <tr key={i} className="hover:bg-bg-tertiary transition-colors">
                                        <td className="py-4 px-6 text-sm font-bold text-text-primary">{dept.department}</td>
                                        <td className="py-4 px-6 text-sm text-right text-text-tertiary">{dept.total}</td>
                                        <td className="py-4 px-6 text-sm text-right text-success">{dept.resolved}</td>
                                        <td className="py-4 px-6 text-sm text-right text-warning">{dept.pending}</td>
                                        <td className="py-4 px-6 text-right">
                                            <span className={`text-sm font-bold ${dept.resolutionRate >= 70 ? 'text-success' : 'text-error'}`}>
                                                {dept.resolutionRate}%
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-right text-text-secondary">
                                            {formatDuration(dept.avgResolutionHours)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AdminDashboard;
