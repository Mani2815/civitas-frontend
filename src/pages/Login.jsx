import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Input from '../components/Input';
import Button from '../components/Button';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(email, password);
            toast.success(`Welcome back, ${user.name}`);
            const paths = { citizen: '/citizen', staff: '/staff', admin: '/admin' };
            navigate(paths[user.role] || '/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (role) => {
        setEmail(`${role}@demo.com`);
        setPassword('password123');
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    icon={HiOutlineMail}
                    required
                />

                <div className="space-y-1">
                    <Input
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        icon={HiOutlineLockClosed}
                        required
                    />
                    <div className="flex justify-end">
                        <a href="#" className="text-xs text-primary hover:text-primary-light">
                            Forgot password?
                        </a>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-semibold hover:scale-[1.02] transition-all shadow-sm border border-neutral-200 dark:border-neutral-800 hover:bg-gradient-to-r hover:from-[#2e4374] hover:via-[#a5c0ee] hover:to-[#e6a575] hover:border-transparent hover:text-white dark:hover:text-white relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    <span className="relative z-10">{loading ? 'Signing in...' : 'Sign In'}</span>
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4 text-center">Quick Demo Login</p>
                <div className="flex gap-3 justify-center">
                    {['citizen', 'staff', 'admin'].map((role) => (
                        <button
                            key={role}
                            onClick={() => fillDemo(role)}
                            className="px-4 py-2 bg-bg-tertiary hover:bg-bg-secondary text-text-primary text-xs font-medium rounded-lg border border-border capitalize transition-colors"
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-center mt-8 text-sm text-text-secondary">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-primary hover:text-primary-light transition-colors">
                    Create account
                </Link>
            </p>
        </div>
    );
};

export default Login;
