import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const dashboardMap = {
            citizen: '/citizen',
            staff: '/staff',
            admin: '/admin',
        };
        return <Navigate to={dashboardMap[user.role] || '/login'} replace />;
    }

    return children;
};

export default ProtectedRoute;
