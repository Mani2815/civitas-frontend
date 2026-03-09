import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CitizenDashboard from '../pages/CitizenDashboard';
import StaffDashboard from '../pages/StaffDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import CreateComplaint from '../pages/CreateComplaint';
import ComplaintDetails from '../pages/ComplaintDetails';
import StaffManagement from '../pages/StaffManagement';
import AnalyticsReports from '../pages/AnalyticsReports';

const AppRoutes = () => {
    const { user, isAuthenticated } = useAuth();

    // Determine dashboard redirect based on role
    const getDashboardPath = () => {
        if (!user) return '/login';
        const paths = { citizen: '/citizen', staff: '/staff', admin: '/admin' };
        return paths[user.role] || '/login';
    };

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={isAuthenticated ? <Navigate to={getDashboardPath()} /> : <Landing />} />

            <Route element={<AuthLayout />}>
                <Route path="/login" element={isAuthenticated ? <Navigate to={getDashboardPath()} /> : <Login />} />
                <Route path="/register" element={isAuthenticated ? <Navigate to={getDashboardPath()} /> : <Register />} />
            </Route>

            {/* Citizen Routes */}
            <Route element={
                <ProtectedRoute roles={['citizen']}>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route path="/citizen" element={<CitizenDashboard />} />
                <Route path="/citizen/new-complaint" element={<CreateComplaint />} />
                <Route path="/citizen/complaints/:id" element={<ComplaintDetails />} />
            </Route>

            {/* Staff Routes */}
            <Route element={
                <ProtectedRoute roles={['staff']}>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route path="/staff" element={<StaffDashboard />} />
                <Route path="/staff/complaints/:id" element={<ComplaintDetails />} />
            </Route>

            {/* Admin Routes */}
            <Route element={
                <ProtectedRoute roles={['admin']}>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/staff" element={<StaffManagement />} />
                <Route path="/admin/analytics" element={<AnalyticsReports />} />
                <Route path="/admin/complaints/:id" element={<ComplaintDetails />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
