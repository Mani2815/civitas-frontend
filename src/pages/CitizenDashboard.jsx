import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import complaintService from '../services/complaintService';
import analyticsService from '../services/analyticsService';
import { useAuth } from '../context/AuthContext';
import { STATUS_COLORS, PRIORITY_LEVEL_COLORS, CATEGORY_ICONS, STATUSES, CHART_COLORS, STATUS_CHART_COLORS } from '../utils/constants';
import { formatRelativeTime, truncateText } from '../utils/formatters';
import { HiOutlinePlusCircle, HiOutlineClipboardList, HiOutlineClock, HiOutlineCheckCircle, HiOutlineChartBar, HiOutlineTag, HiOutlineGlobeAlt, HiOutlineUser } from 'react-icons/hi';
import { ArrowBigUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import Card from '../components/Card';

const CitizenDashboard = () => {
    const { user } = useAuth();
    const [statusFilter, setStatusFilter] = useState('');
    const [viewTab, setViewTab] = useState('personal'); // 'personal' or 'city'

    const { data: complaintsData, isLoading: complaintsLoading, refetch: refetchComplaints } = useQuery({
        queryKey: ['citizen-complaints', statusFilter, viewTab],
        queryFn: () => complaintService.getComplaints({ 
            status: statusFilter || undefined,
            sort: viewTab === 'city' ? '-upvotes' : '-createdAt',
            scope: viewTab === 'city' ? 'city' : 'personal'
        }),
    });

    const handleUpvote = async (e, complaintId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await complaintService.upvoteComplaint(complaintId);
            refetchComplaints();
        } catch (error) {
            console.error('Upvote failed:', error);
            // Optionally add a toast notification here if available
        }
    };

    const { data: personalStatsData, isLoading: personalStatsLoading } = useQuery({
        queryKey: ['citizen-personal-stats'],
        queryFn: () => analyticsService.getCitizenStats(),
    });

    const { data: cityStatsData, isLoading: cityStatsLoading } = useQuery({
        queryKey: ['citizen-city-stats'],
        queryFn: () => analyticsService.getCityStats(),
        enabled: viewTab === 'city',
    });

    const complaints = complaintsData?.data?.complaints || [];
    
    // Stats for the current view
    const currentStats = viewTab === 'personal' 
        ? personalStatsData?.data || { total: 0, pending: 0, resolved: 0, categoryDistribution: [], statusDistribution: [] }
        : cityStatsData?.data?.overview || { total: 0, pending: 0, resolved: 0 };
    
    const chartData = viewTab === 'personal'
        ? personalStatsData?.data || { categoryDistribution: [], statusDistribution: [] }
        : cityStatsData?.data || { categories: [], statuses: [] };

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-bg-secondary border border-border p-2 rounded-md shadow-lg">
                <p className="text-[10px] font-bold text-text-tertiary mb-1">{label || payload[0].name}</p>
                {payload.map((p, i) => (
                    <p key={i} className="text-[10px] text-text-tertiary">
                        Count: <span className="font-bold text-text-primary">{p.value}</span>
                    </p>
                ))}
            </div>
        );
    };

    if (complaintsLoading || personalStatsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-civic-green border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header with Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary">
                            Welcome, {user?.name?.split(' ')[0]}
                        </h2>
                        <p className="text-sm text-text-secondary mt-1">Track complaints and city progress</p>
                    </div>
                    
                    <nav className="flex gap-4">
                        <button
                            onClick={() => setViewTab('personal')}
                            className={`flex items-center gap-2 pb-2 text-sm font-bold transition-all border-b-2 ${viewTab === 'personal' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-text-tertiary hover:text-text-secondary'}`}
                        >
                            <HiOutlineUser className="w-4 h-4" />
                            My Activities
                        </button>
                        <button
                            onClick={() => setViewTab('city')}
                            className={`flex items-center gap-2 pb-2 text-sm font-bold transition-all border-b-2 ${viewTab === 'city' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-text-tertiary hover:text-text-secondary'}`}
                        >
                            <HiOutlineGlobeAlt className="w-4 h-4" />
                            City Overview
                        </button>
                    </nav>
                </div>
                
                <div className="pb-2">
                    <Link to="/citizen/new-complaint" className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-sm font-semibold rounded-full shadow-sm hover:scale-[1.02] transition-all btn-premium-hover">
                        <HiOutlinePlusCircle className="w-5 h-5" />
                        File New Complaint
                    </Link>
                </div>
            </div>

            {/* View-specific Content */}
            <div className="space-y-6 animate-fade-in relative">
                {cityStatsLoading && viewTab === 'city' && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                         <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        title={viewTab === 'personal' ? "Total Filed" : "Total City Cases"}
                        value={currentStats.total}
                        icon={HiOutlineClipboardList}
                        color="blue"
                    />
                    <StatCard
                        title="Currently Active"
                        value={currentStats.pending}
                        icon={HiOutlineClock}
                        color="orange"
                    />
                    <StatCard
                        title="Successfully Resolved"
                        value={currentStats.resolved}
                        icon={HiOutlineCheckCircle}
                        color="primary"
                    />
                </div>

                {/* Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <HiOutlineTag className="w-4 h-4 text-text-tertiary" />
                            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                {viewTab === 'personal' ? 'My Categories' : 'City-wide Categories'}
                            </h3>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={viewTab === 'personal' ? chartData.categoryDistribution : chartData.categories}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={60}
                                    innerRadius={40}
                                    dataKey="value"
                                    nameKey="name"
                                    stroke="none"
                                >
                                    {(viewTab === 'personal' ? chartData.categoryDistribution : chartData.categories).map((_, i) => (
                                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <HiOutlineChartBar className="w-4 h-4 text-text-tertiary" />
                            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                {viewTab === 'personal' ? 'My Status Distribution' : 'Overall Status'}
                            </h3>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={viewTab === 'personal' ? chartData.statusDistribution : chartData.statuses} barCategoryGap={15}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {(viewTab === 'personal' ? chartData.statusDistribution : chartData.statuses).map((entry, i) => (
                                        <Cell key={i} fill={STATUS_CHART_COLORS[entry.name] || CHART_COLORS[i % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>

            {/* Complaints Feed Header */}
            <div className="pt-4 border-t border-border mt-8">
               <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                   <HiOutlineClipboardList className="w-5 h-5 text-text-tertiary" />
                   Recent Complaints Feed
               </h3>
                <div className="flex gap-2 flex-wrap mb-4">
                    <button
                        onClick={() => setStatusFilter('')}
                        className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 active:scale-95 ${!statusFilter ? 'bg-neutral-900 border-neutral-900 text-white shadow-md' : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'}`}
                    >
                        All
                    </button>
                    {STATUSES.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 active:scale-95 ${statusFilter === s ? 'bg-neutral-900 border-neutral-900 text-white shadow-md' : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Complaints List */}
            {complaints.length === 0 ? (
                <div className="card text-center p-12">
                    <p className="text-text-tertiary mb-4">No complaints found</p>
                    <Link to="/citizen/new-complaint" className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-sm font-semibold rounded-full shadow-sm hover:scale-[1.02] transition-all btn-premium-hover">
                        File Your First Complaint
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {complaints.map((complaint) => (
                        <Link
                            key={complaint._id}
                            to={`/citizen/complaints/${complaint._id}`}
                            className="card card-hover p-5 block"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        {(() => { const cat = CATEGORY_ICONS[complaint.category]; if (!cat) return null; const { icon: Icon, className, bgClassName } = cat; return <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${bgClassName}`}><Icon className={`w-4 h-4 ${className}`} /></span>; })()}
                                        <h3 className="text-sm font-bold text-text-primary truncate">
                                            {complaint.title}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-text-secondary mb-3">{truncateText(complaint.description, 120)}</p>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className={`badge ${STATUS_COLORS[complaint.status]}`}>{complaint.status}</span>
                                        {complaint.priorityLevel && (
                                            <span className={`badge ${PRIORITY_LEVEL_COLORS[complaint.priorityLevel]}`}>{complaint.priorityLevel}</span>
                                        )}
                                        <span className="text-xs text-text-tertiary">{complaint.address}</span>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                                    <p className="text-xs text-text-tertiary">{formatRelativeTime(complaint.createdAt)}</p>
                                    
                                    <div className="flex items-center gap-2">
                                        {complaint.priorityLevel && (
                                            <span className="text-sm font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                                                P:{complaint.priorityScore}
                                            </span>
                                        )}
                                        
                                        <button
                                            onClick={(e) => handleUpvote(e, complaint._id)}
                                            disabled={['Resolved', 'Rejected'].includes(complaint.status)}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-200 text-white ${
                                                ['Resolved', 'Rejected'].includes(complaint.status)
                                                    ? 'opacity-50 cursor-not-allowed bg-[#1A1A1B]'
                                                    : complaint.upvotedBy?.includes(user?._id)
                                                        ? 'bg-[#1A1A1B] border border-orange-500/30'
                                                        : 'bg-[#1A1A1B] hover:bg-[#272729] active:scale-95'
                                            }`}
                                            title={
                                                ['Resolved', 'Rejected'].includes(complaint.status)
                                                    ? `Complaint is ${complaint.status.toLowerCase()}`
                                                    : complaint.upvotedBy?.includes(user?._id)
                                                        ? "Retract support"
                                                        : "upvote"
                                            }
                                        >
                                            <ArrowBigUp 
                                                className={`w-5 h-5 transition-colors ${
                                                    complaint.upvotedBy?.includes(user?._id)
                                                        ? 'fill-orange-500 text-orange-500'
                                                        : 'text-white group-hover:text-orange-400'
                                                }`} 
                                            />
                                            {complaint.upvotes > 0 && (
                                                <span className="text-sm font-bold font-sans">
                                                    {complaint.upvotes}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CitizenDashboard;
