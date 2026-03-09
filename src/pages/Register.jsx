import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Input from '../components/Input';
import Button from '../components/Button';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone } from 'react-icons/hi';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });
            toast.success('Account created successfully');
            navigate('/citizen');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Full Name"
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    icon={HiOutlineUser}
                    required
                />

                <Input
                    label="Email Address"
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    icon={HiOutlineMail}
                    required
                />

                <Input
                    label="Phone Number"
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    icon={HiOutlinePhone}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Password"
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        icon={HiOutlineLockClosed}
                        required
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        icon={HiOutlineLockClosed}
                        required
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-semibold hover:scale-[1.02] transition-all shadow-sm border border-neutral-200 dark:border-neutral-800 hover:bg-gradient-to-r hover:from-[#2e4374] hover:via-[#a5c0ee] hover:to-[#e6a575] hover:border-transparent hover:text-white dark:hover:text-white relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <span className="relative z-10">{loading ? 'Creating Account...' : 'Create Account'}</span>
                    </button>
                </div>
            </form>

            <p className="text-center mt-6 text-sm text-text-secondary">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary hover:text-primary-light transition-colors">
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default Register;
