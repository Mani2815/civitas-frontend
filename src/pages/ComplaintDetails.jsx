import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import complaintService from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import { STATUS_COLORS, PRIORITY_LEVEL_COLORS, CATEGORY_ICONS, STATUS_DOT_COLORS, STATUSES } from '../utils/constants';
import { formatDateTime, formatRelativeTime } from '../utils/formatters';
import { HiOutlineArrowLeft, HiOutlineLocationMarker, HiOutlineClock, HiOutlineUser, HiOutlinePhotograph } from 'react-icons/hi';
import toast from 'react-hot-toast';
import MapEmbed from '../components/MapEmbed';

const ComplaintDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [newComment, setNewComment] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [statusUpdate, setStatusUpdate] = useState('');
    const [remarks, setRemarks] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['complaint', id],
        queryFn: () => complaintService.getComplaintById(id),
    });

    const statusMutation = useMutation({
        mutationFn: () => complaintService.updateStatus(id, statusUpdate, remarks),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['complaint', id] });
            setStatusUpdate('');
            setRemarks('');
            toast.success('Status updated');
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
    });

    const commentMutation = useMutation({
        mutationFn: () => complaintService.addComment(id, newComment, isInternal),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['complaint', id] });
            setNewComment('');
            toast.success('Comment added');
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed to add comment'),
    });

    const complaint = data?.data?.complaint;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-civic-green border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="card p-12 text-center">
                <p className="text-text-tertiary mb-4">Complaint not found</p>
                <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-sm font-semibold rounded-full shadow-sm hover:scale-[1.02] transition-all btn-premium-hover">Go Back</button>
            </div>
        );
    }

    const timeline = complaint.timeline || [];
    const comments = complaint.comments || [];

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition-colors"
            >
                <HiOutlineArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </button>

            {/* Header */}
            <div className="card p-6">
                <div className="flex items-start gap-3 mb-4">
                    {(() => { const cat = CATEGORY_ICONS[complaint.category]; if (!cat) return null; const { icon: Icon, className, bgClassName } = cat; return <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${bgClassName}`}><Icon className={`w-6 h-6 ${className}`} /></span>; })()}
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-text-primary">{complaint.title}</h1>
                        <div className="flex items-center gap-3 flex-wrap mt-2">
                            <span className={`badge ${STATUS_COLORS[complaint.status]}`}>{complaint.status}</span>
                            <span className={`badge ${PRIORITY_LEVEL_COLORS[complaint.priorityLevel]}`}>{complaint.priorityLevel}</span>
                            <span className="text-sm font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                                Priority Score: {complaint.priorityScore}
                            </span>
                            {complaint.slaBreach && (
                                <span className="badge bg-error/20 text-error border border-error/20">⚠ SLA BREACH</span>
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed">{complaint.description}</p>

                {/* Meta Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-text-tertiary">
                        <HiOutlineUser className="w-4 h-4" />
                        <span>Filed by: <span className="text-text-primary">{complaint.citizen?.name}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-tertiary">
                        <HiOutlineClock className="w-4 h-4" />
                        <span>{formatDateTime(complaint.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-tertiary">
                        <HiOutlineLocationMarker className="w-4 h-4" />
                        <span>{complaint.address}</span>
                    </div>
                    {complaint.assignedTo && (
                        <div className="flex items-center gap-2 text-sm text-text-tertiary">
                            <HiOutlineUser className="w-4 h-4" />
                            <span>Assigned to: <span className="text-text-primary">{complaint.assignedTo.name}</span></span>
                        </div>
                    )}
                    {complaint.department && (
                        <div className="text-sm text-text-tertiary">
                            Department: <span className="text-text-primary">{complaint.department.name}</span>
                        </div>
                    )}
                    {complaint.location?.lat && complaint.location?.lng && (
                        <div className="space-y-3">
                            <div className="text-sm text-text-tertiary">
                                GPS: {complaint.location.lat.toFixed(4)}, {complaint.location.lng.toFixed(4)}
                            </div>
                            <MapEmbed
                                lat={complaint.location.lat}
                                lng={complaint.location.lng}
                                height="250px"
                            />
                        </div>
                    )}
                </div>

                {/* Resolution remarks */}
                {complaint.resolutionRemarks && (
                    <div className="mt-4 p-3 bg-bg-tertiary border border-border rounded-lg">
                        <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Resolution Remarks</p>
                        <p className="text-sm text-text-primary">{complaint.resolutionRemarks}</p>
                    </div>
                )}
            </div>

            {/* Photos */}
            {complaint.photos?.length > 0 && (
                <div className="card p-6">
                    <h3 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
                        <HiOutlinePhotograph className="w-5 h-5" />
                        Photos ({complaint.photos.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {complaint.photos.map((photo, i) => (
                            <img
                                key={i}
                                src={photo.url}
                                alt={`Complaint photo ${i + 1}`}
                                className="w-full h-40 object-cover rounded-lg border border-border"
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Status Timeline */}
            <div className="card p-6">
                <h3 className="text-base font-bold text-text-primary mb-4">Status Timeline</h3>
                {timeline.length > 0 ? (
                    <div className="relative pl-6 space-y-4">
                        <div className="absolute left-2 top-2 bottom-2 w-px bg-border"></div>
                        {timeline.map((entry, i) => (
                            <div key={i} className="relative">
                                <div className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 ${i === timeline.length - 1
                                    ? 'bg-primary border-primary'
                                    : 'bg-bg-tertiary border-border'
                                    }`}></div>
                                <div className="ml-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`status-dot ${STATUS_DOT_COLORS[entry.newStatus] || ''}`}></span>
                                        <span className="text-sm font-medium text-text-primary">{entry.newStatus}</span>
                                        {entry.oldStatus && (
                                            <span className="text-xs text-text-tertiary">← {entry.oldStatus}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-text-tertiary mt-0.5">
                                        {entry.updatedBy?.name} · {formatDateTime(entry.createdAt)}
                                    </p>
                                    {entry.remarks && (
                                        <p className="text-xs text-text-secondary mt-1">{entry.remarks}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-text-tertiary">No timeline entries</p>
                )}
            </div>

            {/* Status Update (Staff & Admin) */}
            {['staff', 'admin'].includes(user?.role) && !['Resolved', 'Rejected'].includes(complaint.status) && (
                <div className="card p-6">
                    <h3 className="text-base font-bold text-text-primary mb-4">Update Status</h3>
                    <div className="space-y-3">
                        <div className="flex gap-2 flex-wrap">
                            {STATUSES.filter((s) => s !== complaint.status).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatusUpdate(s)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${statusUpdate === s
                                        ? 'bg-primary-lighter/15 text-primary border-primary-light/20'
                                        : 'text-text-tertiary border-border hover:text-text-primary bg-bg-secondary'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        {statusUpdate && (
                            <>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    className="input-field min-h-[80px]"
                                    placeholder="Add remarks (optional)"
                                />
                                <button
                                    onClick={() => statusMutation.mutate()}
                                    disabled={!remarks}
                                    className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-sm font-semibold rounded-full shadow-sm hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-premium-hover"
                                >
                                    {statusMutation.isPending ? 'Updating...' : `Update to ${statusUpdate}`}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Comments */}
            <div className="card p-6">
                <h3 className="text-base font-bold text-text-primary mb-4">
                    Comments ({comments.length})
                </h3>

                {/* Comment Form */}
                <div className="mb-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="input-field min-h-[80px]"
                        placeholder="Add a comment..."
                    />
                    <div className="flex items-center justify-between mt-2">
                        {['staff', 'admin'].includes(user?.role) && (
                            <label className="flex items-center gap-2 text-xs text-text-tertiary cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isInternal}
                                    onChange={(e) => setIsInternal(e.target.checked)}
                                    className="rounded border-border"
                                />
                                Internal note (staff only)
                            </label>
                        )}
                        <button
                            onClick={() => commentMutation.mutate()}
                            disabled={!newComment.trim() || commentMutation.isPending}
                            className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-sm font-semibold rounded-full shadow-sm hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-premium-hover"
                        >
                            {commentMutation.isPending ? 'Posting...' : 'Add Comment'}
                        </button>
                    </div>
                </div>

                {/* Comments List */}
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <div
                            key={comment._id}
                            className={`p-4 rounded-lg border ${comment.isInternal
                                ? 'bg-warning-light/5 border-warning-light/15'
                                : 'bg-bg-secondary border-border'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-sm font-medium text-text-primary">{comment.userId?.name}</span>
                                <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${comment.userId?.role === 'admin' ? 'bg-secondary-purple/15 text-secondary-purple' :
                                    comment.userId?.role === 'staff' ? 'bg-info/15 text-info' :
                                        'bg-text-tertiary/15 text-text-tertiary'
                                    }`}>
                                    {comment.userId?.role}
                                </span>
                                {comment.isInternal && (
                                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-warning/15 text-warning">
                                        Internal
                                    </span>
                                )}
                                <span className="text-xs text-text-tertiary ml-auto">{formatRelativeTime(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm text-text-secondary">{comment.message}</p>
                        </div>
                    ))}
                    {comments.length === 0 && (
                        <p className="text-sm text-text-tertiary text-center py-4">No comments yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetails;
