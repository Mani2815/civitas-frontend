import {
    HiOutlineBeaker,
    HiOutlineMap,
    HiOutlineBolt,
    HiOutlineArchiveBox,
    HiOutlineTrash,
    HiOutlineHome,
    HiOutlineSpeakerWave,
    HiOutlineClipboardDocument,
} from 'react-icons/hi2';
import { BsDroplet, BsCarFront } from 'react-icons/bs';

// Complaint categories
export const CATEGORIES = [
    'Water', 'Roads', 'Electricity', 'Sanitation', 'Waste', 'Parks', 'Noise', 'Other',
];

// Severity levels
export const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];

// Status options
export const STATUSES = ['Pending', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'];

// Category icons — each entry has { icon, className, bgClassName }
export const CATEGORY_ICONS = {
    Water: { icon: BsDroplet, className: 'text-blue-400', bgClassName: 'bg-blue-500/10' },
    Roads: { icon: HiOutlineMap, className: 'text-amber-400', bgClassName: 'bg-amber-500/10' },
    Electricity: { icon: HiOutlineBolt, className: 'text-yellow-400', bgClassName: 'bg-yellow-500/10' },
    Sanitation: { icon: HiOutlineArchiveBox, className: 'text-cyan-400', bgClassName: 'bg-cyan-500/10' },
    Waste: { icon: HiOutlineTrash, className: 'text-green-400', bgClassName: 'bg-green-500/10' },
    Parks: { icon: BsCarFront, className: 'text-emerald-400', bgClassName: 'bg-emerald-500/10' },
    Noise: { icon: HiOutlineSpeakerWave, className: 'text-purple-400', bgClassName: 'bg-purple-500/10' },
    Other: { icon: HiOutlineClipboardDocument, className: 'text-slate-400', bgClassName: 'bg-slate-500/10' },
};

// Status colors for CSS classes
export const STATUS_COLORS = {
    Pending: 'badge-pending',
    Acknowledged: 'badge-acknowledged',
    'In Progress': 'badge-in-progress',
    Resolved: 'badge-resolved',
    Rejected: 'badge-rejected',
};

// Status dot colors
export const STATUS_DOT_COLORS = {
    Pending: 'status-dot-pending',
    Acknowledged: 'status-dot-acknowledged',
    'In Progress': 'status-dot-in-progress',
    Resolved: 'status-dot-resolved',
    Rejected: 'status-dot-rejected',
};

// Severity badge classes
export const SEVERITY_COLORS = {
    Critical: 'severity-critical',
    High: 'severity-high',
    Medium: 'severity-medium',
    Low: 'severity-low',
};

// Priority level colors
export const PRIORITY_COLORS = {
    HIGH: 'priority-high',
    MEDIUM: 'priority-medium',
    LOW: 'priority-low',
};

// Priority level badge colors (for auto-calculated priority)
export const PRIORITY_LEVEL_COLORS = {
    Critical: 'bg-red-500/15 text-red-400 border border-red-500/20',
    High: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
    Medium: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    Low: 'bg-secondary-800 text-gray-400 border border-secondary-700',
};

// Chart colors (Dark SaaS Palette)
export const CHART_COLORS = [
    '#10b981', // Emerald 500
    '#3b82f6', // Blue 500
    '#f59e0b', // Amber 500
    '#ef4444', // Red 500
    '#8b5cf6', // Violet 500
    '#06b6d4', // Cyan 500
    '#ec4899', // Pink 500
];

export const STATUS_CHART_COLORS = {
    Pending: '#f59e0b', // Amber
    Acknowledged: '#8b5cf6', // Violet
    'In Progress': '#3b82f6', // Blue
    Resolved: '#10b981', // Emerald
    Rejected: '#ef4444', // Red
};
