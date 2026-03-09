import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { HiOutlineMenu, HiOutlineX, HiOutlineLogout, HiOutlineHome, HiOutlinePlusCircle, HiOutlineChartBar, HiOutlineViewGrid, HiOutlineClipboardList, HiOutlineUserGroup, HiOutlineOfficeBuilding } from 'react-icons/hi';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Navigation items based on role
    const getNavItems = () => {
        const base = `/${user?.role}`;
        switch (user?.role) {
            case 'citizen':
                return [
                    { path: base, label: 'Overview', icon: HiOutlineHome },
                    { path: `${base}/new-complaint`, label: 'File Complaint', icon: HiOutlinePlusCircle },
                ];
            case 'staff':
                return [
                    { path: base, label: 'Assignments', icon: HiOutlineClipboardList },
                ];
            case 'admin':
                return [
                    { path: base, label: 'Dashboard', icon: HiOutlineViewGrid },
                    { path: `${base}/staff`, label: 'Staff Roster', icon: HiOutlineUserGroup },
                    { path: `${base}/analytics`, label: 'Analytics', icon: HiOutlineChartBar },
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems();

    return (
        <div className="min-h-screen bg-bg-primary flex text-text-primary transition-colors duration-200">

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-bg-secondary border-r border-border shadow-xl transform transition-all duration-200 ease-in-out
                lg:static lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center px-6 border-b border-border">
                    <Link to="/" className="flex items-center gap-0 text-xl font-extrabold tracking-tighter text-text-primary hover:opacity-80 transition-opacity">
                        <svg className="w-8 h-8 translate-y-[2px]" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 10 L180 50 L160 160 L100 200 L40 160 L20 50 Z"
                                fill="none" stroke="currentColor" strokeWidth="14" />
                            <rect x="65" y="100" width="20" height="40" fill="currentColor" />
                            <rect x="92" y="80" width="25" height="60" fill="currentColor" />
                            <rect x="122" y="110" width="20" height="30" fill="currentColor" />
                        </svg>
                        <span>civitas</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden ml-auto text-text-tertiary hover:text-text-primary"
                    >
                        <HiOutlineX className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    <p className="px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Menu</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all
                                    ${isActive
                                        ? 'bg-neutral-900 text-white shadow-sm'
                                        : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-text-tertiary'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-bg-secondary">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-bg-tertiary flex items-center justify-center text-sm font-bold text-text-primary border border-border shadow-sm">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                            <p className="text-xs text-text-secondary truncate capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                    >
                        <HiOutlineLogout className="w-4 h-4" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 dark:bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto bg-bg-primary transition-colors duration-200">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
