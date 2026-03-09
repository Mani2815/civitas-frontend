import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import complaintService from '../services/complaintService';
import { CATEGORIES, CATEGORY_ICONS } from '../utils/constants';
import toast from 'react-hot-toast';
import { HiOutlinePhotograph, HiOutlineLocationMarker, HiOutlineX } from 'react-icons/hi';
import { motion } from 'framer-motion';
import MapEmbed from '../components/MapEmbed';

const CreateComplaint = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        address: '',
        lat: '',
        lng: '',
    });
    const [photos, setPhotos] = useState([]);
    const [previews, setPreviews] = useState([]);

    const mutation = useMutation({
        mutationFn: (data) => complaintService.createComplaint(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['citizen-complaints'] });
            toast.success('Complaint submitted successfully!');
            navigate('/citizen');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to submit complaint');
        },
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (photos.length + files.length > 5) {
            toast.error('Maximum 5 photos allowed');
            return;
        }
        setPhotos([...photos, ...files]);
        const newPreviews = files.map((f) => URL.createObjectURL(f));
        setPreviews([...previews, ...newPreviews]);
    };

    const removePhoto = (index) => {
        setPhotos(photos.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setFormData({
                        ...formData,
                        lat: pos.coords.latitude.toFixed(6),
                        lng: pos.coords.longitude.toFixed(6),
                    });
                    toast.success('Location detected');
                },
                () => toast.error('Could not get location. Please enter manually.')
            );
        }
    };

    const handleSubmit = () => {
        const fd = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key]) fd.append(key, formData[key]);
        });
        photos.forEach((photo) => fd.append('photos', photo));
        mutation.mutate(fd);
    };

    const canProceed = () => {
        if (step === 1) return formData.category;
        if (step === 2) return formData.title && formData.description;
        if (step === 3) return formData.address;
        return true;
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-2">File a Complaint</h2>
            <p className="text-sm text-text-secondary mb-6">Report an infrastructure or service issue</p>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-8">
                {['Category', 'Details', 'Location', 'Photos'].map((label, i) => (
                    <div key={label} className="flex-1">
                        <div className={`h-1 rounded-full transition-colors ${i + 1 <= step ? 'bg-primary' : 'bg-bg-tertiary'
                            }`}></div>
                        <p className={`text-xs mt-1.5 ${i + 1 <= step ? 'text-primary' : 'text-text-tertiary'
                            }`}>{label}</p>
                    </div>
                ))}
            </div>

            {/* Step 1: Category */}
            {step === 1 && (
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-light via-accent to-secondary-teal rounded-2xl md:rounded-[1.5rem] blur-lg opacity-20"></div>
                    <div className="relative card p-6 space-y-6 bg-bg-secondary w-full">
                        <div>
                            <label className="input-label mb-3 block">Category</label>
                            <div className="relative">
                                {formData.category && (() => {
                                    const cat = CATEGORY_ICONS[formData.category];
                                    if (!cat) return null;
                                    const { icon: Icon, className, bgClassName } = cat;
                                    return (
                                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-lg ${bgClassName} pointer-events-none z-10`}>
                                            <Icon className={`w-4 h-4 ${className}`} />
                                        </span>
                                    );
                                })()}
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`input-field appearance-none cursor-pointer pr-10 ${formData.category ? 'pl-12' : 'pl-4'} transition-all`}
                                >
                                    <option value="" disabled>Select a category…</option>
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Title & Description */}
            {step === 2 && (
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-light via-accent to-secondary-teal rounded-2xl md:rounded-[1.5rem] blur-lg opacity-20"></div>
                    <div className="relative card p-6 space-y-4 bg-bg-secondary w-full">
                        <div>
                            <label className="input-label">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Brief title describing the issue"
                                maxLength={200}
                            />
                        </div>
                        <div>
                            <label className="input-label">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="input-field min-h-[140px] resize-y"
                                placeholder="Provide detailed description of the issue. Include landmarks, condition, and impact."
                                maxLength={2000}
                            />
                            <p className="text-xs text-text-tertiary mt-1">{formData.description.length}/2000 characters</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-light via-accent to-secondary-teal rounded-2xl md:rounded-[1.5rem] blur-lg opacity-20"></div>
                    <div className="relative card p-6 space-y-4 bg-bg-secondary w-full">
                        <div>
                            <label className="input-label">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Street address, area, and city"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">Latitude</label>
                                <input
                                    type="number"
                                    name="lat"
                                    value={formData.lat}
                                    onChange={handleChange}
                                    className="input-field text-sm"
                                    placeholder="12.9716"
                                    step="any"
                                />
                            </div>
                            <div>
                                <label className="input-label">Longitude</label>
                                <input
                                    type="number"
                                    name="lng"
                                    value={formData.lng}
                                    onChange={handleChange}
                                    className="input-field text-sm"
                                    placeholder="77.5946"
                                    step="any"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={getLocation}
                            className="flex items-center gap-2 text-sm px-5 py-2.5 bg-neutral-900 hover:bg-black text-white font-semibold rounded-full shadow-sm hover:scale-[1.02] transition-all btn-premium-hover"
                        >
                            <HiOutlineLocationMarker className="w-4 h-4" />
                            Detect My Location
                        </button>

                        {/* Interactive Map — drag pin or click to set location */}
                        <MapEmbed
                            lat={formData.lat ? parseFloat(formData.lat) : null}
                            lng={formData.lng ? parseFloat(formData.lng) : null}
                            onPositionChange={(newLat, newLng) => {
                                setFormData(prev => ({
                                    ...prev,
                                    lat: newLat.toFixed(10),
                                    lng: newLng.toFixed(10),
                                }));
                            }}
                            height="350px"
                            className="mt-2"
                        />
                    </div>
                </div>
            )}

            {/* Step 4: Photos */}
            {step === 4 && (
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-light via-accent to-secondary-teal rounded-2xl md:rounded-[1.5rem] blur-lg opacity-20"></div>
                    <div className="relative card p-6 space-y-4 bg-bg-secondary w-full">
                        <div>
                            <label className="input-label">Upload Photos (Optional, max 5)</label>
                            <label className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary-light transition-colors">
                                <HiOutlinePhotograph className="w-6 h-6 text-text-tertiary" />
                                <span className="text-sm text-text-secondary">Click to upload photos</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {previews.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                                {previews.map((p, i) => (
                                    <div key={i} className="relative group">
                                        <img src={p} alt="" className="w-full h-24 object-cover rounded-lg border border-border" />
                                        <button
                                            onClick={() => removePhoto(i)}
                                            className="absolute top-1 right-1 w-6 h-6 bg-error/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <HiOutlineX className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Summary */}
                        <div className="bg-bg-tertiary border border-border rounded-lg p-4 mt-4">
                            <h4 className="text-sm font-bold text-text-primary mb-2">Complaint Summary</h4>
                            <div className="space-y-1 text-xs text-text-secondary">
                                <p><span className="text-text-tertiary">Category:</span> {formData.category}</p>
                                <p><span className="text-text-tertiary">Title:</span> {formData.title}</p>
                                <p><span className="text-text-tertiary">Address:</span> {formData.address}</p>
                                <p><span className="text-text-tertiary">Photos:</span> {photos.length} attached</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
                {step > 1 ? (
                    <button onClick={() => setStep(step - 1)} className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-sm font-semibold rounded-full shadow-sm hover:scale-[1.02] transition-all btn-premium-hover">
                        Back
                    </button>
                ) : (
                    <div />
                )}
                {step < 4 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        disabled={!canProceed()}
                        className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-sm font-semibold rounded-full shadow-sm hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-premium-hover"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                        className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-sm font-semibold rounded-full shadow-sm hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed gap-2 btn-premium-hover"
                    >
                        {mutation.isPending ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Submitting...
                            </span>
                        ) : 'Submit Complaint'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CreateComplaint;
