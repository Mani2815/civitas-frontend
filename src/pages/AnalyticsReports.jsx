import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import analyticsService from '../services/analyticsService';
import complaintService from '../services/complaintService';
import {
    HiOutlineChartPie, HiOutlineDocumentReport, HiOutlineDownload,
    HiOutlineFilter, HiOutlineRefresh, HiOutlineCalendar
} from 'react-icons/hi';
import { CHART_COLORS, STATUS_CHART_COLORS, PRIORITY_LEVEL_COLORS } from '../utils/constants';
import toast from 'react-hot-toast';

const AnalyticsReports = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [dateRange, setDateRange] = useState('30'); // days

    // Fetch Analytics Data
    const { data: overviewData, isLoading: overviewLoading } = useQuery({
        queryKey: ['analytics-overview'],
        queryFn: () => analyticsService.getOverview(),
    });

    const { data: trendData, isLoading: trendLoading } = useQuery({
        queryKey: ['analytics-trends', dateRange],
        queryFn: () => analyticsService.getTrends(parseInt(dateRange)),
    });

    const { data: categoryData, isLoading: catLoading } = useQuery({
        queryKey: ['analytics-categories'],
        queryFn: () => analyticsService.getCategoryDistribution(),
    });

    const { data: statusData, isLoading: statusLoading } = useQuery({
        queryKey: ['analytics-status'],
        queryFn: () => analyticsService.getStatusDistribution(),
    });

    const { data: deptData, isLoading: deptLoading } = useQuery({
        queryKey: ['analytics-departments'],
        queryFn: () => analyticsService.getDepartmentPerformance(),
    });

    // Fetch Raw Data for Reports
    const { data: complaintsData, isLoading: complaintsLoading } = useQuery({
        queryKey: ['all-complaints-report'],
        queryFn: () => complaintService.getComplaints({ limit: 1000, sort: '-createdAt' }),
    });

    const overview = overviewData?.data || {};
    const trends = trendData?.data || [];
    const categories = categoryData?.data || [];
    const statuses = statusData?.data || [];
    const departments = deptData?.data || [];
    const complaints = complaintsData?.data?.complaints || [];

    const downloadReport = (data, filename) => {
        if (!data || !data.length) {
            toast.error('No data to export');
            return;
        }

        // Convert JSON to CSV
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
        toast.success('Report downloaded');
    };

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
    );

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-bg-secondary border border-border rounded-lg px-3 py-2 shadow-lg">
                <p className="text-xs text-text-tertiary mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} className="text-xs" style={{ color: p.color }}>
                        {p.name}: {p.value}
                    </p>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Analytics & Reports</h2>
                    <p className="text-sm text-text-secondary mt-1">Deep dive into system performance and data exports</p>
                </div>
                <div className="flex items-center gap-2 bg-bg-secondary p-1 rounded-lg border border-border">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary-lighter/10 text-primary' : 'text-text-tertiary hover:text-text-primary'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('trends')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'trends' ? 'bg-primary-lighter/10 text-primary' : 'text-text-tertiary hover:text-text-primary'}`}
                    >
                        Trends
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-primary-lighter/10 text-primary' : 'text-text-tertiary hover:text-text-primary'}`}
                    >
                        Reports
                    </button>
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Category Distribution */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-text-primary mb-6">Complaint Categories</h3>
                        <div className="h-80">
                            {catLoading ? <LoadingSpinner /> : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categories}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categories.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Status Distribution */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-text-primary mb-6">Current Status</h3>
                        <div className="h-80">
                            {statusLoading ? <LoadingSpinner /> : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statuses} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                                        <XAxis type="number" stroke="var(--text-tertiary)" />
                                        <YAxis dataKey="name" type="category" stroke="var(--text-tertiary)" width={100} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="value" name="Complaints" radius={[0, 4, 4, 0]}>
                                            {statuses.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={STATUS_CHART_COLORS[entry.name] || '#64748b'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Department Performance */}
                    <div className="card p-6 lg:col-span-2">
                        <h3 className="text-lg font-bold text-text-primary mb-6">Department Performance</h3>
                        <div className="overflow-x-auto">
                            {deptLoading ? <LoadingSpinner /> : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border text-xs text-text-tertiary uppercase tracking-wider">
                                            <th className="p-3 font-medium">Department</th>
                                            <th className="p-3 font-medium text-right">Total</th>
                                            <th className="p-3 font-medium text-right">Resolved</th>
                                            <th className="p-3 font-medium text-right">Pending</th>
                                            <th className="p-3 font-medium text-right">Resolution Rate</th>
                                            <th className="p-3 font-medium text-right">Avg Time (Hrs)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border text-sm">
                                        {departments.map((dept) => (
                                            <tr key={dept.departmentId} className="hover:bg-bg-tertiary transition-colors">
                                                <td className="p-3 font-medium text-text-primary">{dept.department}</td>
                                                <td className="p-3 text-right text-text-secondary">{dept.total}</td>
                                                <td className="p-3 text-right text-success">{dept.resolved}</td>
                                                <td className="p-3 text-right text-warning">{dept.pending}</td>
                                                <td className="p-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className="text-text-secondary">{dept.resolutionRate}%</span>
                                                        <div className="w-16 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${dept.resolutionRate >= 80 ? 'bg-success' :
                                                                    dept.resolutionRate >= 50 ? 'bg-info' : 'bg-error'
                                                                    }`}
                                                                style={{ width: `${dept.resolutionRate}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-right text-text-secondary">{dept.avgResolutionHours}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Trends Tab */}
            {activeTab === 'trends' && (
                <div className="card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-text-primary">Complaint Trends</h3>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="input-field w-auto py-1 pl-3 pr-8 text-sm"
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                        </select>
                    </div>
                    <div className="h-96">
                        {trendLoading ? <LoadingSpinner /> : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trends}>
                                    <defs>
                                        <linearGradient id="colorFiled" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                    <XAxis dataKey="date" stroke="var(--text-tertiary)" tick={{ fontSize: 12 }} />
                                    <YAxis stroke="var(--text-tertiary)" tick={{ fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="filed"
                                        name="Filed"
                                        stroke="#ef4444"
                                        fillOpacity={1}
                                        fill="url(#colorFiled)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="resolved"
                                        name="Resolved"
                                        stroke="#10b981"
                                        fillOpacity={1}
                                        fill="url(#colorResolved)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
                <div className="space-y-6">
                    {/* Complaints Report */}
                    <div className="card p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-text-primary">All Complaints Report</h3>
                                <p className="text-sm text-text-secondary">Comprehensive list of all complaints with status and priority</p>
                            </div>
                            <button
                                onClick={() => {
                                    const reportData = complaints.map(c => ({
                                        ID: c._id,
                                        Category: c.category,
                                        Priority: c.priorityLevel,
                                        Status: c.status,
                                        Date: new Date(c.createdAt).toLocaleDateString(),
                                        Address: c.address
                                    }));
                                    downloadReport(reportData, 'complaints_report');
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-sm font-semibold rounded-full shadow-sm hover:scale-[1.02] transition-all btn-premium-hover"
                                disabled={complaintsLoading}
                            >
                                <HiOutlineDownload className="w-4 h-4" />
                                Export CSV
                            </button>
                        </div>
                        {complaintsLoading ? <LoadingSpinner /> : (
                            <div className="overflow-x-auto max-h-96">
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-bg-secondary z-10">
                                        <tr className="border-b border-border text-xs text-text-tertiary uppercase tracking-wider">
                                            <th className="p-3 font-medium">Category</th>
                                            <th className="p-3 font-medium">Priority</th>
                                            <th className="p-3 font-medium">Status</th>
                                            <th className="p-3 font-medium">Date</th>
                                            <th className="p-3 font-medium">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border text-sm">
                                        {complaints.slice(0, 50).map((c) => (
                                            <tr key={c._id} className="hover:bg-bg-tertiary transition-colors">
                                                <td className="p-3 text-text-primary">{c.category}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${c.priorityLevel === 'Critical' ? 'bg-error/15 text-error border-error/20' :
                                                        c.priorityLevel === 'High' ? 'bg-warning/15 text-warning border-warning/20' :
                                                            c.priorityLevel === 'Medium' ? 'bg-info/15 text-info border-info/20' :
                                                                'bg-success/15 text-success border-success/20'
                                                        }`}>
                                                        {c.priorityLevel}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-text-secondary">{c.status}</td>
                                                <td className="p-3 text-text-secondary">{new Date(c.createdAt).toLocaleDateString()}</td>
                                                <td className="p-3 text-text-secondary truncate max-w-xs">{c.address}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {complaints.length > 50 && (
                                    <p className="p-3 text-xs text-center text-text-tertiary border-t border-border">
                                        Showing first 50 rows. Export to see all {complaints.length} rows.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Critical Incidents Report */}
                    <div className="card p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-text-primary">Critical Incidents</h3>
                                <p className="text-sm text-text-secondary">Filtered report of only Critical priority issues</p>
                            </div>
                            <button
                                onClick={() => {
                                    const criticalData = complaints
                                        .filter(c => c.priorityLevel === 'Critical')
                                        .map(c => ({
                                            ID: c._id,
                                            Category: c.category,
                                            Status: c.status,
                                            Since: new Date(c.createdAt).toLocaleDateString()
                                        }));
                                    downloadReport(criticalData, 'critical_incidents_report');
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-sm font-semibold rounded-full shadow-sm hover:scale-[1.02] transition-all btn-premium-hover"
                                disabled={complaintsLoading}
                            >
                                <HiOutlineDownload className="w-4 h-4" />
                                Export CSV
                            </button>
                        </div>
                        {/* We can reuse the table logic or just show stats here */}
                        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-error/20 rounded-full">
                                    <HiOutlineDocumentReport className="w-5 h-5 text-error" />
                                </div>
                                <span className="text-error font-medium">
                                    {complaints.filter(c => c.priorityLevel === 'Critical').length} Critical Incidents found
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsReports;
