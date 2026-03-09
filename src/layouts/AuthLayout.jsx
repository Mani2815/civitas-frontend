import { Outlet } from 'react-router-dom';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import Card from '../components/Card';

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-1">
                        <svg className="w-12 h-12 text-text-primary translate-y-[2px]" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 10 L180 50 L160 160 L100 200 L40 160 L20 50 Z"
                                fill="none" stroke="currentColor" strokeWidth="14" />
                            <rect x="65" y="100" width="20" height="40" fill="currentColor" />
                            <rect x="92" y="80" width="25" height="60" fill="currentColor" />
                            <rect x="122" y="110" width="20" height="30" fill="currentColor" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-sans font-bold text-text-primary tracking-tight">
                        civitas
                    </h1>
                    <p className="text-text-secondary mt-2">
                        Sign in to access your account
                    </p>
                </div>

                <div className="relative">
                    {/* Gradient Glow Underneath Card */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-light via-accent to-secondary-teal rounded-[1.5rem] md:rounded-[2rem] blur-lg opacity-30"></div>

                    <Card className="relative border-border shadow-2xl rounded-[1.5rem] md:rounded-[2rem] bg-bg-secondary w-full">
                        <Outlet />
                    </Card>
                </div>

                <p className="mt-8 text-center text-xs text-text-tertiary">
                    &copy; 2026 Smart City Governance. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AuthLayout;
