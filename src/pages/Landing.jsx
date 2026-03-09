import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineOfficeBuilding, HiOutlineShieldCheck, HiOutlineChartBar, HiOutlineLightningBolt, HiOutlineLocationMarker, HiOutlineArrowRight, HiOutlineSun, HiOutlineMoon, HiOutlineDocumentAdd, HiOutlineBeaker, HiOutlineEye, HiOutlineCheckCircle, HiOutlineStar } from 'react-icons/hi';
import Card from '../components/Card';

const SpotlightButton = ({ children, className = '', variant = 'dark', ...props }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const isLight = variant === 'light';

    return (
        <button
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={`relative overflow-hidden rounded-full transition-all duration-300 hover:scale-105 group ${isLight
                ? 'bg-white text-black border border-neutral-200 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)]'
                : 'bg-[#0a0a0a] text-white border border-neutral-800 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]'
                } ${className}`}
            {...props}
        >
            {/* Added soft inner glow outline layers */}
            <div
                className={`absolute inset-0 rounded-full pointer-events-none z-10 ${isLight
                    ? 'shadow-[inset_0_0_8px_rgba(0,0,0,0.15),inset_0_0_16px_rgba(0,0,0,0.08),inset_0_0_24px_rgba(0,0,0,0.04)]'
                    : 'shadow-[inset_0_0_12px_rgba(255,255,255,0.4),inset_0_0_24px_rgba(255,255,255,0.2),inset_0_0_36px_rgba(255,255,255,0.1)]'
                    }`}
            />
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out z-0"
                style={{
                    opacity: isLight ? opacity * 0.4 : opacity,
                    background: 'linear-gradient(to right, rgba(59, 130, 246, 0.8), rgba(251, 146, 60, 0.8))',
                    WebkitMaskImage: `radial-gradient(150px circle at ${position.x}px ${position.y}px, black 10%, transparent 100%)`,
                    maskImage: `radial-gradient(150px circle at ${position.x}px ${position.y}px, black 10%, transparent 100%)`,
                    filter: 'blur(2px)' // slight blur on the gradient background itself before masking
                }}
            />
            <span className="relative z-20">{children}</span>
        </button>
    );
};

const FadeIn = ({ children, delay = 0, className = '', y = 20 }) => (
    <motion.div
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

const Landing = () => {
    return (
        <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-primary selection:text-white overflow-hidden">

            {/* Background Effects (Start Gradients matching the provided image) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden block">
                {/* 1. Soft Blue/Lavender Ambient Glow (Left & Right) */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[800px] bg-indigo-200/40 dark:bg-indigo-900/20 blur-[130px] rounded-full"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[800px] bg-blue-200/40 dark:bg-blue-900/20 blur-[130px] rounded-full"></div>

                {/* 2. Intense Horizontal Orange/Peach Bar (Navbar backing) */}
                <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[110%] max-w-[1500px] h-[350px] bg-gradient-to-r from-orange-200/80 via-orange-400/60 to-orange-200/80 dark:from-orange-500/20 dark:via-orange-600/20 dark:to-orange-500/20 blur-[80px] rounded-[100%]"></div>

                {/* Subtle Grid overlay */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]"></div>
            </div>

            {/* Navbar (Pill Design) */}
            <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl h-16 flex items-center justify-between px-6 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                {/* Logo */}
                <div className="flex items-center">
                    <a href="#hero" className="flex items-center gap-0 text-2xl font-extrabold tracking-tighter text-text-primary hover:opacity-80 transition-opacity">
                        <svg className="w-8 h-8 translate-y-[2px]" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 10 L180 50 L160 160 L100 200 L40 160 L20 50 Z"
                                fill="none" stroke="currentColor" strokeWidth="14" />
                            <rect x="65" y="100" width="20" height="40" fill="currentColor" />
                            <rect x="92" y="80" width="25" height="60" fill="currentColor" />
                            <rect x="122" y="110" width="20" height="30" fill="currentColor" />
                        </svg>
                        <span>civitas</span>
                    </a>
                </div>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center gap-8">
                    {[
                        { name: 'Features', href: '#features' },
                        { name: 'Process', href: '#process' },
                        { name: 'About', href: '#about' }
                    ].map(item => (
                        <a key={item.name} href={item.href} className="flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase text-text-primary hover:text-primary transition-colors">
                            {item.name}
                            <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link to="/login">
                        <SpotlightButton variant="light" className="px-5 py-2.5 text-sm font-semibold">
                            Sign In
                        </SpotlightButton>
                    </Link>
                    <Link to="/register">
                        <SpotlightButton className="px-5 py-2.5 text-sm font-semibold">
                            Get Started
                        </SpotlightButton>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section id="hero" className="relative z-10 pt-36 md:pt-40 pb-32 px-6 text-center max-w-5xl mx-auto scroll-mt-32">
                <FadeIn delay={0.1}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-secondary border border-border mb-8">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <span className="text-xs font-bold text-primary tracking-wider uppercase">AI Powered Governance</span>
                    </div>
                </FadeIn>

                <FadeIn delay={0.2} y={30}>
                    <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6 leading-tight tracking-tight">
                        Smart City Complaint <br />
                        <span className="text-black">Management & Analytics Platform</span>
                    </h1>
                </FadeIn>

                <FadeIn delay={0.3} y={30}>
                    <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
                        A comprehensive civic-tech platform enabling citizens to file infrastructure complaints,
                        staff to manage resolutions, and administrators to monitor performance with real-time analytics.
                    </p>
                </FadeIn>

                <FadeIn delay={0.4} y={20}>
                    <div className="flex items-center justify-center gap-4">
                        <Link to="/register">
                            <SpotlightButton variant="light" className="px-8 py-3 text-base font-semibold">
                                <div className="flex items-center gap-2">File a Complaint <HiOutlineArrowRight className="w-5 h-5" /></div>
                            </SpotlightButton>
                        </Link>
                        <Link to="/login">
                            <SpotlightButton className="px-8 py-3 text-base font-semibold relative overflow-hidden group">
                                Staff Login
                            </SpotlightButton>
                        </Link>
                    </div>
                </FadeIn>
            </section>

            {/* Features Grid */}
            <section id="features" className="relative z-20 isolate px-6 pb-16 max-w-7xl mx-auto scroll-mt-24">
                {/* Left gradient blob */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[280px] h-[400px] bg-blue-200/50 blur-[100px] rounded-full pointer-events-none -z-10"></div>
                {/* Right gradient blob */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[280px] h-[400px] bg-purple-200/50 blur-[100px] rounded-full pointer-events-none -z-10"></div>

                <div className="bg-white rounded-[3rem] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.06)] border border-neutral-100 pt-16 pb-20 px-8 md:px-16 text-center">
                    {/* Badge */}
                    <FadeIn delay={0.1}>
                        <div className="flex justify-center mb-6">
                            <span className="inline-flex items-center px-5 py-2 rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-[#2D3A8C] text-[11px] font-extrabold tracking-widest uppercase border border-neutral-100">
                                Platform Features
                            </span>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <h2 className="text-4xl md:text-5xl font-medium text-text-primary mb-4 tracking-tight">
                            Everything You Need to Transform Your City
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <p className="text-text-secondary max-w-xl mx-auto mb-16 text-sm md:text-base leading-relaxed">
                            A comprehensive suite of tools designed to bridge the gap between citizens and city governance.
                        </p>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                        {[
                            {
                                icon: HiOutlineShieldCheck,
                                title: 'File Complaints',
                                desc: 'Report infrastructure issues with photos and GPS location. Track status in real-time.',
                                color: 'text-primary-light bg-primary/10'
                            },
                            {
                                icon: HiOutlineChartBar,
                                title: 'Analytics Dashboard',
                                desc: 'Data-driven insights with charts, KPIs, and department performance tracking.',
                                color: 'text-info bg-info/10'
                            },
                            {
                                icon: HiOutlineLightningBolt,
                                title: 'Priority Scoring',
                                desc: 'AI-powered priority algorithm balancing severity, time, and hotspot density.',
                                color: 'text-warning bg-warning/10'
                            },
                            {
                                icon: HiOutlineLocationMarker,
                                title: 'SLA Compliance',
                                desc: 'Automated deadline tracking and SLA breach detection for accountability.',
                                color: 'text-secondary-purple bg-secondary-purple/10'
                            },
                        ].map((feature, i) => (
                            <FadeIn key={i} delay={0.1 + i * 0.1} className="h-full">
                                <Card className="h-full group hover:border-primary-light transition-all duration-300">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-text-primary mb-3">{feature.title}</h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </Card>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>


            {/* How It Works Section */}
            <section id="process" className="relative z-20 isolate px-6 pb-16 max-w-7xl mx-auto scroll-mt-24">
                {/* Left gradient blob */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[280px] h-[400px] bg-blue-200/50 blur-[100px] rounded-full pointer-events-none -z-10"></div>
                {/* Right gradient blob */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[280px] h-[400px] bg-purple-200/50 blur-[100px] rounded-full pointer-events-none -z-10"></div>

                <div className="bg-white rounded-[3rem] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.06)] border border-neutral-100 pt-16 pb-20 px-8 md:px-16 text-center">
                    <FadeIn delay={0.1}>
                        <div className="flex justify-center mb-6">
                            <span className="inline-flex items-center px-5 py-2 rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-[#2D3A8C] text-[11px] font-extrabold tracking-widest uppercase border border-neutral-100">
                                Simple Process
                            </span>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <h2 className="text-4xl md:text-5xl font-medium text-text-primary mb-6 tracking-tight">
                            How It Works
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <p className="text-text-secondary max-w-2xl mx-auto mb-20 text-sm md:text-base leading-relaxed">
                            Four simple steps from reporting to resolution. We make civic engagement effortless.
                        </p>
                    </FadeIn>

                    <div className="relative max-w-5xl mx-auto">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[48px] left-[12%] w-[76%] h-[2px] bg-gradient-to-r from-info to-success opacity-30 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                            {[
                                {
                                    num: '01',
                                    icon: HiOutlineDocumentAdd,
                                    title: 'Report an Issue',
                                    desc: 'Snap a photo, add a description, and pin the location on the map. Our smart form auto-fills details for you.'
                                },
                                {
                                    num: '02',
                                    icon: HiOutlineBeaker,
                                    title: 'AI Analysis & Routing',
                                    desc: 'Our AI engine categorizes, prioritizes, and assigns your complaint to the appropriate department automatically.'
                                },
                                {
                                    num: '03',
                                    icon: HiOutlineEye,
                                    title: 'Track Progress',
                                    desc: 'Receive real-time updates as your issue moves through the resolution pipeline. Know exactly where things stand.'
                                },
                                {
                                    num: '04',
                                    icon: HiOutlineCheckCircle,
                                    title: 'Issue Resolved',
                                    desc: 'Get notified the moment your complaint is resolved. Rate the resolution and help improve city services.'
                                }
                            ].map((step, i) => (
                                <FadeIn key={i} delay={0.1 + i * 0.15} className="flex flex-col items-center text-center relative z-10 w-full">
                                    <div className="relative w-28 h-28 bg-bg-secondary rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-border flex items-center justify-center mb-8 mx-auto transition-transform hover:-translate-y-1 duration-300">
                                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-info text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-info/30">
                                            {step.num}
                                        </div>
                                        <step.icon className="w-10 h-10 text-info" />
                                    </div>
                                    <h3 className="text-lg font-extrabold text-text-primary mb-3 tracking-tight">{step.title}</h3>
                                    <p className="text-xs text-text-secondary leading-relaxed px-4">
                                        {step.desc}
                                    </p>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Impact Section as Card */}
            <section id="about" className="relative z-20 isolate w-full pt-16 pb-32 scroll-mt-32">
                {/* Left gradient blob */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[320px] h-[400px] bg-blue-200/50 blur-[100px] rounded-full pointer-events-none"></div>
                {/* Right gradient blob */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[320px] h-[400px] bg-purple-200/50 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 text-center text-text-primary">
                    <div className="bg-white rounded-[3rem] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.06)] border border-neutral-100 pt-16 pb-20 px-8 md:px-12 relative">
                        <FadeIn delay={0.1} className="relative z-10">
                            <div className="flex justify-center mb-8">
                                <span className="inline-flex items-center px-5 py-2 rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-[#2D3A8C] text-[11px] font-extrabold tracking-widest uppercase border border-neutral-100">
                                    Our Impact
                                </span>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.2} className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-serif text-[#1C2434] mb-4 tracking-tight font-medium">
                                Trusted by Thousands
                            </h2>
                        </FadeIn>

                        <FadeIn delay={0.3} className="relative z-10">
                            <p className="text-text-secondary max-w-2xl mx-auto mb-20 text-sm md:text-base leading-relaxed">
                                Numbers that reflect our commitment to building better cities together.
                            </p>
                        </FadeIn>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
                            {/* Metric 1 - Complaints Resolved */}
                            <FadeIn delay={0.4} className="flex flex-col items-center">
                                <div className="w-12 h-12 flex items-center justify-center text-[#21B573] mb-6">
                                    {/* Simple outlined circle checkmark */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                                        <circle cx="12" cy="12" r="9" />
                                        <polyline points="9 12 11 14 15 10" />
                                    </svg>
                                </div>
                                <h3 className="text-4xl md:text-5xl font-bold font-serif text-[#1C2434] mb-2 tracking-tight">
                                    50,000+
                                </h3>
                                <p className="text-xs text-[#6B7280] font-medium tracking-wide">Complaints Resolved</p>
                            </FadeIn>

                            {/* Metric 2 - City Departments */}
                            <FadeIn delay={0.5} className="flex flex-col items-center">
                                <div className="w-12 h-12 flex items-center justify-center text-[#2D3A8C] mb-6">
                                    {/* Office building */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                                        <rect x="3" y="4" width="18" height="17" rx="1" />
                                        <line x1="3" y1="9" x2="21" y2="9" />
                                        <line x1="9" y1="9" x2="9" y2="21" />
                                        <rect x="6" y="12" width="2" height="2" />
                                        <rect x="12" y="12" width="2" height="2" />
                                        <rect x="6" y="16" width="2" height="2" />
                                        <rect x="12" y="16" width="2" height="2" />
                                    </svg>
                                </div>
                                <h3 className="text-4xl md:text-5xl font-bold font-serif text-[#1C2434] mb-2 tracking-tight">
                                    120+
                                </h3>
                                <p className="text-xs text-[#6B7280] font-medium tracking-wide">City Departments</p>
                            </FadeIn>

                            {/* Metric 3 - Satisfaction Rate */}
                            <FadeIn delay={0.6} className="flex flex-col items-center">
                                <div className="w-12 h-12 flex items-center justify-center text-[#F59E0B] mb-6">
                                    {/* Simple outlined star */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                                    </svg>
                                </div>
                                <h3 className="text-4xl md:text-5xl font-bold font-serif text-[#1C2434] mb-2 tracking-tight">
                                    98%
                                </h3>
                                <p className="text-xs text-[#6B7280] font-medium tracking-wide">Satisfaction Rate</p>
                            </FadeIn>

                            {/* Metric 4 - Avg. Resolution Time */}
                            <FadeIn delay={0.7} className="flex flex-col items-center">
                                <div className="w-12 h-12 flex items-center justify-center text-[#FACC15] mb-6">
                                    {/* Simple solid lightning bolt */}
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
                                        <path d="M13 2L4.09 12.26A1 1 0 005 14h6v8l8.91-10.26A1 1 0 0019 10h-6V2z" />
                                    </svg>
                                </div>
                                <h3 className="text-4xl md:text-5xl font-bold font-serif text-[#1C2434] mb-2 tracking-tight">
                                    24hrs
                                </h3>
                                <p className="text-xs text-[#6B7280] font-medium tracking-wide">Avg. Resolution Time</p>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-20 isolate px-6 pb-24 max-w-[1400px] mx-auto">
                <div className="relative overflow-hidden rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(31,58,147,0.3)] border border-white/20 flex flex-col items-center bg-gradient-to-b from-[#313b5a] via-[#4a587e] to-[#b3c9ec]">

                    {/* SVG Shared Defs (Global Styles for these SVGs) */}
                    <svg width="0" height="0" className="absolute hidden">
                        <defs>
                            <style dangerouslySetInnerHTML={{
                                __html: `
                                @keyframes cloudMove { 0% { transform: translateX(-50px); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translateX(850px); opacity: 0; } }
                                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                                @keyframes pulseSignal { 0% { opacity: 0.1; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.2); } 100% { opacity: 0; transform: scale(1.8); } }
                                @keyframes driveCar { 0% { transform: translateX(850px); } 100% { transform: translateX(-50px); } }
                                @keyframes driveTrain { 0% { transform: translateX(-200px); } 100% { transform: translateX(900px); } }
                                @keyframes flyPlane { 0% { transform: translate(850px, 0); } 100% { transform: translate(-150px, -50px); } }
                                @keyframes dashAnim { to { stroke-dashoffset: -20; } }
                                @keyframes spinWheel { 100% { transform: rotate(360deg); } }
                                @keyframes floatDrone { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(5px, -5px); } 50% { transform: translate(10px, 0); } 75% { transform: translate(5px, 5px); } }
                                
                                .cloud-1 { animation: cloudMove 40s linear infinite; }
                                .cloud-2 { animation: cloudMove 30s linear infinite; animation-delay: -15s; }
                                .cloud-3 { animation: cloudMove 50s linear infinite; animation-delay: -5s; }
                                .float-1 { animation: float 4s ease-in-out infinite; }
                                .float-2 { animation: float 5s ease-in-out infinite; animation-delay: -1.5s; }
                                .float-3 { animation: float 6s ease-in-out infinite; animation-delay: -3s; }
                                .signal-1 { animation: pulseSignal 2s ease-out infinite; transform-origin: center; }
                                .signal-2 { animation: pulseSignal 2s ease-out infinite; animation-delay: 0.6s; transform-origin: center; }
                                .signal-3 { animation: pulseSignal 2s ease-out infinite; animation-delay: 1.2s; transform-origin: center; }
                                .car-move { animation: driveCar 12s linear infinite; }
                                .train-move { animation: driveTrain 15s linear infinite; }
                                .plane-move { animation: flyPlane 30s linear infinite; }
                                .connecting-line { stroke-dasharray: 6 6; animation: dashAnim 1s linear infinite; }
                                .turbine-spin { animation: spinWheel 4s linear infinite; transform-origin: 0 0; }
                                .drone-float { animation: floatDrone 6s ease-in-out infinite; }
                                
                                .stroke-main { stroke: rgba(255, 255, 255, 0.85); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
                                .stroke-bold { stroke: rgba(255, 255, 255, 1); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
                                .fill-solid { fill: rgba(255, 255, 255, 0.9); }
                                .fill-light { fill: rgba(255, 255, 255, 0.1); }
                                .fill-medium { fill: rgba(255, 255, 255, 0.3); }
                            `}} />
                        </defs>
                    </svg>

                    {/* Top Clouds Layer */}
                    <div className="absolute top-0 inset-x-0 flex justify-center w-full opacity-60 pointer-events-none pt-2 sm:pt-4 z-0 overflow-hidden">
                        <svg width="100%" height="auto" viewBox="0 0 800 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[150%] sm:w-[120%] lg:w-[105%] max-w-none">
                            {/* Moving Clouds */}
                            <g className="stroke-main fill-light">
                                <path d="M0,0 Q10,-10 20,0 Q30,-5 40,5 Q50,0 60,10 H0 Z" className="cloud-1" transform="translate(50, 40) scale(1.5)" />
                                <path d="M0,0 Q10,-10 20,0 Q30,-5 40,5 Q50,0 60,10 H0 Z" className="cloud-2" transform="translate(300, 60) scale(1.2)" />
                                <path d="M0,0 Q10,-10 20,0 Q30,-5 40,5 Q50,0 60,10 H0 Z" className="cloud-3" transform="translate(550, 20) scale(2)" />
                            </g>
                        </svg>
                    </div>

                    {/* Content Layer (Foreground) */}
                    <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center mt-20 md:mt-28 px-8">
                        <FadeIn delay={0.1}>
                            <h2 className="text-3xl md:text-[2.75rem] md:whitespace-nowrap font-serif text-white leading-tight tracking-tight font-medium drop-shadow-md z-20">
                                Ready to Make Your City Smarter?
                            </h2>
                        </FadeIn>
                    </div>

                    {/* Bottom City SVG & Button */}
                    <div className="w-full relative z-0 mt-8 md:mt-4 flex items-end justify-center mb-[-2%] opacity-80 md:opacity-100 overflow-hidden rounded-b-[3rem]">
                        {/* Button positioned between buildings */}
                        <div className="absolute inset-x-0 bottom-[35%] md:bottom-[40%] flex justify-center z-20 pointer-events-auto">
                            <FadeIn delay={0.3} y={10}>
                                <Link to="/register">
                                    <SpotlightButton variant="light" className="px-8 py-3.5 text-sm font-semibold tracking-wide relative !bg-white/40 hover:!bg-white/50 backdrop-blur-xl outline outline-1 outline-white/60 shadow-lg hover:shadow-xl transition-all">
                                        Get Started Now
                                    </SpotlightButton>
                                </Link>
                            </FadeIn>
                        </div>

                        <svg width="100%" height="auto" viewBox="0 50 800 270" preserveAspectRatio="xMidYMax slice" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full min-w-[800px] h-auto drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] pointer-events-none">

                            {/* Connecting lines from antenna to nodes */}
                            <g className="stroke-main connecting-line" opacity="0.6">
                                <polyline points="400,100 250,90 150,90" />
                                <polyline points="400,100 280,50 220,50" />
                                <polyline points="400,100 400,60 350,30" />
                                <polyline points="400,100 450,50 500,50" />
                                <polyline points="400,100 550,90 620,90" />
                                <polyline points="400,100 600,140 700,140" />
                                <polyline points="400,100 200,160 100,160" />
                            </g>

                            {/* Floating Nodes (Circles with icons) */}
                            <g className="stroke-bold fill-light cursor-pointer">
                                {/* Node 1: Chart */}
                                <g className="float-1" transform="translate(150, 90)">
                                    <circle cx="0" cy="0" r="22" className="hover:fill-medium transition-colors" />
                                    <path d="M-8,8 L8,8 M-6,8 V-2 M0,8 V-6 M6,8 V2 M-10,0 L0,-10 L5,-5 L10,-12" className="stroke-main" fill="none" />
                                </g>
                                {/* Node 2: Buildings */}
                                <g className="float-2" transform="translate(220, 50)">
                                    <circle cx="0" cy="0" r="22" className="hover:fill-medium transition-colors" />
                                    <rect x="-8" y="-10" width="16" height="20" className="stroke-main" fill="none" />
                                    <line x1="-8" y1="0" x2="8" y2="0" className="stroke-main" />
                                    <line x1="0" y1="-10" x2="0" y2="10" className="stroke-main" />
                                </g>
                                {/* Node 3: Bulb */}
                                <g className="float-3" transform="translate(350, 30)">
                                    <circle cx="0" cy="0" r="24" className="hover:fill-medium transition-colors" />
                                    <path d="M-6,-2 A8,8 0 1,1 6,-2 C6,2 4,4 4,6 L-4,6 C-4,4 -6,2 -6,-2 Z" className="stroke-main" fill="none" />
                                    <line x1="-2" y1="10" x2="2" y2="10" className="stroke-main" />
                                </g>
                                {/* Node 4: Heart */}
                                <g className="float-1" transform="translate(500, 50)">
                                    <circle cx="0" cy="0" r="20" className="hover:fill-medium transition-colors" />
                                    <path d="M0,4 C0,4 -6,0 -6,-4 A4,4 0 0,1 0,-6 A4,4 0 0,1 6,-4 C6,0 0,4 0,4 Z" className="stroke-main fill-medium" />
                                </g>
                                {/* Node 5: Briefcase */}
                                <g className="float-2" transform="translate(620, 90)">
                                    <circle cx="0" cy="0" r="22" className="hover:fill-medium transition-colors" />
                                    <rect x="-10" y="-4" width="20" height="14" rx="2" className="stroke-main" fill="none" />
                                    <path d="M-4,-4 V-7 H4 V-4" className="stroke-main" fill="none" />
                                </g>
                                {/* Node 6: Plug */}
                                <g className="float-3" transform="translate(700, 140)">
                                    <circle cx="0" cy="0" r="20" className="hover:fill-medium transition-colors" />
                                    <path d="M-4,-4 L4,4 M0,-8 V-4 M4,-4 V0 M-4,-4 A6,6 0 0,0 4,4 M2,2 L8,8" className="stroke-main" fill="none" />
                                </g>
                                {/* Node 7: Car */}
                                <g className="float-2" transform="translate(100, 160)">
                                    <circle cx="0" cy="0" r="20" className="hover:fill-medium transition-colors" />
                                    <path d="M-8,2 L-6,-2 H4 L8,2 V6 H-8 Z M-4,6 A2,2 0 1,0 -4,10 A2,2 0 1,0 -4,6 M4,6 A2,2 0 1,0 4,10 A2,2 0 1,0 4,6" className="stroke-main" fill="none" />
                                </g>
                            </g>

                            {/* Airplane */}
                            <g className="plane-move stroke-main fill-medium">
                                <path d="M0,0 L20,-5 L40,-5 L50,0 L40,5 L20,5 Z" />
                                <path d="M15,-3 L10,-20 L25,-5" fill="none" />
                                <path d="M15,3 L10,20 L25,5" fill="none" />
                                <path d="M45,-2 L40,-10 L50,-2" fill="none" />
                            </g>

                            {/* Drone */}
                            <g className="drone-float stroke-main fill-none" transform="translate(250, 140)">
                                <line x1="-15" y1="-5" x2="15" y2="-5" />
                                <ellipse cx="-15" cy="-5" rx="6" ry="2" className="turbine-spin" />
                                <ellipse cx="15" cy="-5" rx="6" ry="2" className="turbine-spin" />
                                <rect x="-6" y="-2" width="12" height="6" rx="2" className="fill-medium" />
                                <circle cx="0" cy="6" r="2" className="fill-solid" />
                                <path d="M-2,4 L0,6 L2,4" />
                            </g>

                            {/* City Skyline */}
                            {/* Background layer */}
                            <g className="stroke-main fill-light" opacity="0.6">
                                <rect x="180" y="160" width="40" height="120" />
                                <rect x="230" y="120" width="50" height="160" />
                                <polygon points="230,120 255,80 280,120" />
                                <rect x="550" y="140" width="60" height="140" />
                                <polygon points="550,140 610,100 610,140" />
                                <rect x="630" y="170" width="45" height="110" />
                            </g>

                            {/* Midground layer */}
                            <g className="stroke-main fill-light">
                                {/* Factory */}
                                <g transform="translate(60, 200)">
                                    <rect x="0" y="40" width="80" height="40" className="fill-medium" />
                                    <rect x="10" y="10" width="15" height="30" />
                                    <rect x="30" y="20" width="15" height="20" />
                                    <polygon points="50,40 50,10 80,40" />
                                    <circle cx="17.5" cy="-10" r="6" className="cloud-1 fill-solid stroke-none" style={{ animationDuration: '3s', animationName: 'float' }} opacity="0.4" />
                                    <circle cx="37.5" cy="-5" r="5" className="cloud-2 fill-solid stroke-none" style={{ animationDuration: '4s', animationName: 'float' }} opacity="0.4" />
                                </g>

                                {/* Skyscraper 1 */}
                                <g transform="translate(160, 150)">
                                    <rect x="0" y="0" width="60" height="130" className="fill-medium" />
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <rect key={i} x="10" y={20 + i * 15} width="10" height="8" className="fill-solid stroke-none" opacity="0.8" />
                                    ))}
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <rect key={i} x="40" y={20 + i * 15} width="10" height="8" className="fill-solid stroke-none" opacity="0.8" />
                                    ))}
                                </g>

                                {/* Central Complex */}
                                <g transform="translate(240, 180)">
                                    <rect x="0" y="40" width="100" height="60" className="fill-medium" />
                                    <polygon points="0,40 50,10 100,40" className="fill-medium" />
                                    <rect x="25" y="60" width="20" height="20" />
                                    <rect x="55" y="60" width="20" height="20" />
                                </g>

                                {/* Hospital */}
                                <g transform="translate(460, 190)">
                                    <rect x="0" y="0" width="80" height="90" className="fill-medium" />
                                    <rect x="10" y="10" width="60" height="30" />
                                    <text x="40" y="32" className="fill-solid font-bold" fontSize="20" textAnchor="middle" stroke="none">H</text>
                                    <rect x="10" y="50" width="15" height="15" />
                                    <rect x="32.5" y="50" width="15" height="15" />
                                    <rect x="55" y="50" width="15" height="15" />
                                </g>

                                {/* Tall building right */}
                                <g transform="translate(560, 130)">
                                    <rect x="0" y="20" width="50" height="150" className="fill-medium" />
                                    <path d="M-10,20 L60,20 L50,0 L0,0 Z" />
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <line key={i} x1="5" y1={40 + i * 25} x2="45" y2={40 + i * 25} />
                                    ))}
                                </g>
                            </g>

                            {/* Central Transmission Tower */}
                            <g className="stroke-main" transform="translate(390, 60)">
                                <polygon points="10,0 0,140 20,140" className="fill-light" />
                                <line x1="6" y1="40" x2="14" y2="40" />
                                <line x1="3" y1="80" x2="17" y2="80" />
                                <line x1="1" y1="120" x2="19" y2="120" />
                                <line x1="6" y1="40" x2="17" y2="80" />
                                <line x1="14" y1="40" x2="3" y2="80" />
                                <line x1="3" y1="80" x2="19" y2="120" />
                                <line x1="17" y1="80" x2="1" y2="120" />
                                <circle cx="10" cy="-5" r="5" className="fill-solid" />
                                {/* Pulsing signals */}
                                <circle cx="10" cy="-5" r="20" className="signal-1 stroke-bold" fill="none" />
                                <circle cx="10" cy="-5" r="40" className="signal-2 stroke-bold" fill="none" />
                                <circle cx="10" cy="-5" r="60" className="signal-3 stroke-bold" fill="none" />
                            </g>

                            {/* Wind Turbines */}
                            <g className="stroke-main" transform="translate(640, 180)">
                                <line x1="0" y1="0" x2="0" y2="100" />
                                <g className="fill-medium">
                                    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="4s" repeatCount="indefinite" />
                                    <path d="M0,0 Q-15,-25 0,-50 Q15,-25 0,0" />
                                    <g transform="rotate(120)">
                                        <path d="M0,0 Q-15,-25 0,-50 Q15,-25 0,0" />
                                    </g>
                                    <g transform="rotate(240)">
                                        <path d="M0,0 Q-15,-25 0,-50 Q15,-25 0,0" />
                                    </g>
                                    <circle cx="0" cy="0" r="3" className="fill-solid" />
                                </g>
                            </g>
                            <g className="stroke-main" transform="translate(710, 200)">
                                <line x1="0" y1="0" x2="0" y2="80" />
                                <g className="fill-medium">
                                    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="4s" repeatCount="indefinite" />
                                    <path d="M0,0 Q-10,-20 0,-40 Q10,-20 0,0" />
                                    <g transform="rotate(120)">
                                        <path d="M0,0 Q-10,-20 0,-40 Q10,-20 0,0" />
                                    </g>
                                    <g transform="rotate(240)">
                                        <path d="M0,0 Q-10,-20 0,-40 Q10,-20 0,0" />
                                    </g>
                                    <circle cx="0" cy="0" r="3" className="fill-solid" />
                                </g>
                            </g>

                            {/* Ground / Road */}
                            <rect x="0" y="280" width="800" height="40" className="fill-light stroke-none" />
                            <line x1="0" y1="280" x2="800" y2="280" className="stroke-bold" />
                            <line x1="0" y1="320" x2="800" y2="320" className="stroke-bold" />
                            <line x1="0" y1="300" x2="800" y2="300" className="stroke-bold connecting-line" />

                            {/* Train Track */}
                            <rect x="0" y="265" width="800" height="15" className="fill-light stroke-none" />
                            <line x1="0" y1="265" x2="800" y2="265" className="stroke-main" />

                            {/* Track details */}
                            {Array.from({ length: 40 }).map((_, i) => (
                                <line key={i} x1={i * 20} y1="265" x2={i * 20 + 5} y2="280" className="stroke-main" opacity="0.3" />
                            ))}

                            {/* Train */}
                            <g className="train-move stroke-main fill-medium">
                                <rect x="0" y="250" width="150" height="15" rx="4" className="fill-solid" />
                                <rect x="15" y="253" width="25" height="8" fill="none" className="stroke-bold" />
                                <rect x="55" y="253" width="25" height="8" fill="none" className="stroke-bold" />
                                <rect x="95" y="253" width="25" height="8" fill="none" className="stroke-bold" />
                                <path d="M150,265 L165,265 L155,250 L150,250 Z" className="fill-solid" />
                                <circle cx="160" cy="265" r="4" className="fill-solid stroke-none" />
                            </g>

                            {/* Car 1 */}
                            <g className="car-move stroke-main fill-medium">
                                <path d="M0,285 L15,280 L40,280 L55,285 L60,285 L60,296 L-10,296 Z" className="fill-solid" />
                                <circle cx="5" cy="296" r="5" fill="none" className="turbine-spin stroke-bold" />
                                <circle cx="45" cy="296" r="5" fill="none" className="turbine-spin stroke-bold" />
                            </g>

                            {/* Car 2 (reverse) */}
                            <g className="train-move stroke-main fill-medium" style={{ animationDuration: '20s', animationDirection: 'reverse' }}>
                                <g transform="translate(0, 305) scale(-0.8, 0.8)">
                                    <path d="M0,0 L15,-5 L40,-5 L55,0 L60,0 L60,11 L-10,11 Z" className="fill-solid" />
                                    <circle cx="5" cy="11" r="5" fill="none" className="turbine-spin stroke-bold" />
                                    <circle cx="45" cy="11" r="5" fill="none" className="turbine-spin stroke-bold" />
                                </g>
                            </g>

                        </svg>
                    </div>
                </div>
            </section>

            {/* Footer Section - Full-bleed wrapper for gradients */}
            <footer className="relative z-10 pt-20 pb-10 px-6 border-t border-border/50">
                {/* Background Gradients (Now span full screen width) */}
                <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden block h-[800px] z-0">
                    {/* 1. Soft Blue/Lavender Ambient Glow (Left & Right) */}
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[800px] bg-indigo-200/40 dark:bg-indigo-900/20 blur-[130px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[800px] bg-blue-200/40 dark:bg-blue-900/20 blur-[130px] rounded-full"></div>

                    {/* 2. Intense Horizontal Orange/Peach Bar (Footer base) */}
                    <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[110%] max-w-[1500px] h-[400px] bg-gradient-to-r from-orange-200/80 via-orange-400/60 to-orange-200/80 dark:from-orange-500/20 dark:via-orange-600/20 dark:to-orange-500/20 blur-[80px] rounded-[100%]"></div>
                </div>

                {/* Inner Content Wrapper - Constrained to typical max-width */}
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-4 mb-20 text-sm">
                        {/* Brand Col */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-0 mb-2 -mt-1.5">
                                <svg className="w-10 h-10 text-text-primary translate-y-[2px]" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 10 L180 50 L160 160 L100 200 L40 160 L20 50 Z"
                                        fill="none" stroke="currentColor" strokeWidth="14" />
                                    <rect x="65" y="100" width="20" height="40" fill="currentColor" />
                                    <rect x="92" y="80" width="25" height="60" fill="currentColor" />
                                    <rect x="122" y="110" width="20" height="30" fill="currentColor" />
                                </svg>
                                <span className="text-2xl font-extrabold tracking-tighter text-text-primary block leading-none">civitas</span>
                            </div>
                            <p className="text-text-secondary mb-6 text-xs">AI for Smart Cities starts here</p>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="font-bold text-text-primary mb-4 text-[10px] tracking-wider uppercase">Products</h4>
                            <ul className="space-y-3 text-text-secondary">
                                <li><a href="#" className="hover:text-primary transition-colors">Smart City CMS</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-text-primary mb-4 text-[10px] tracking-wider uppercase">Company</h4>
                            <ul className="space-y-3 text-text-secondary">
                                <li><a href="#" className="hover:text-primary transition-colors">About us</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Blogs</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms of service</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-text-primary mb-4 text-[10px] tracking-wider uppercase">Socials</h4>
                            <ul className="space-y-3 text-text-secondary">
                                <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">YouTube</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-text-secondary">
                        <p>Copyright Smart City 2026</p>
                        <p>All rights reserved, Metropolis - 560038</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
