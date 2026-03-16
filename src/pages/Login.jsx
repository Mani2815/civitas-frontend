import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Input from '../components/Input';
import Button from '../components/Button';
import SpotlightButton from '../components/SpotlightButton';
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

                <SpotlightButton
                    type="submit"
                    disabled={loading}
                    variant="light"
                    className="w-full py-2.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </SpotlightButton>
            </form>

            <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4 text-center">Quick Demo Login</p>
                <div className="flex gap-3 justify-center">
                    {['citizen', 'staff', 'admin'].map((role) => (
                        <SpotlightButton
                            key={role}
                            onClick={() => fillDemo(role)}
                            variant="light"
                            showInnerGlow={false}
                            className="px-5 py-2 text-xs font-semibold capitalize !rounded-xl"
                        >
                            {role}
                        </SpotlightButton>
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
