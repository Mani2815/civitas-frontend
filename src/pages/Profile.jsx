import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineShieldCheck, HiOutlineCheckCircle, HiOutlineOfficeBuilding } from 'react-icons/hi';
import userService from '../services/userService';
import toast from 'react-hot-toast';
import Input from '../components/Input';
import SpotlightButton from '../components/SpotlightButton';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user: authUser, updateUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userService.getProfile();
                setUser(response.user);
                setFormData({
                    name: response.user.name || '',
                    phone: response.user.phone || ''
                });
            } catch (error) {
                toast.error('Failed to load profile');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const response = await userService.updateProfile(formData);
            const updatedUser = response.user;
            setUser(updatedUser);
            updateUser(updatedUser); // Sync with AuthContext
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-text-primary mb-2">Account Settings</h1>
                <p className="text-text-secondary">Manage your personal information and preferences.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                >
                    <div className="card bg-bg-secondary p-6 sticky top-24">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent-orange p-1 mb-4 shadow-lg">
                                <div className="w-full h-full rounded-full bg-bg-secondary flex items-center justify-center text-3xl font-bold text-primary capitalize">
                                    {user?.name?.charAt(0)}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-text-primary mb-1 capitalize">{user?.name}</h2>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                                <HiOutlineShieldCheck className="w-3.5 h-3.5" />
                                {user?.role}
                            </div>
                            
                            <div className="w-full space-y-3 pt-4 border-t border-border">
                                <div className="flex items-center gap-3 text-sm text-text-secondary">
                                    <HiOutlineMail className="w-4 h-4 text-text-tertiary" />
                                    <span className="truncate">{user?.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-secondary">
                                    <HiOutlinePhone className="w-4 h-4 text-text-tertiary" />
                                    <span>{user?.phone || 'No phone added'}</span>
                                </div>
                                {user?.department && (
                                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                                        <HiOutlineOfficeBuilding className="w-4 h-4 text-text-tertiary" />
                                        <span>{user.department.name || user.department}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Edit Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <div className="card bg-bg-secondary p-6 lg:p-8">
                        <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                            <HiOutlineUser className="w-5 h-5 text-primary" />
                            Personal Information
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    icon={HiOutlineUser}
                                    required
                                />
                                <Input
                                    label="Phone Number"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    icon={HiOutlinePhone}
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-text-secondary text-sm font-medium mb-2">
                                    Email Address (Non-editable)
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary opacity-50">
                                        <HiOutlineMail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={user?.email}
                                        disabled
                                        className="input-field pl-10 bg-bg-tertiary opacity-60 cursor-not-allowed border-border"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <HiOutlineShieldCheck className="w-5 h-5 text-success" />
                                    </div>
                                </div>
                                <p className="text-xs text-text-tertiary mt-2">Email address is verified and cannot be changed.</p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <SpotlightButton
                                    type="submit"
                                    disabled={updating}
                                    variant="dark"
                                    className="px-8 py-3 text-sm font-bold min-w-[160px]"
                                >
                                    {updating ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Saving...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <HiOutlineCheckCircle className="w-5 h-5" />
                                            Update Profile
                                        </span>
                                    )}
                                </SpotlightButton>
                            </div>
                        </form>
                    </div>

                    <div className="mt-6">
                        <div className="card bg-bg-secondary p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <HiOutlineShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-text-tertiary uppercase font-bold tracking-wider">Account Status</p>
                                <p className="text-sm font-bold text-success">Active & Verified</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
