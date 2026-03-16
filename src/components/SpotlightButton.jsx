import React, { useRef, useState } from 'react';

const SpotlightButton = ({ children, className = '', variant = 'dark', showInnerGlow = true, ...props }) => {
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
            className={`relative overflow-hidden rounded-full transition-all duration-300 hover:scale-[1.02] group ${isLight
                ? 'bg-white text-black border border-neutral-200 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)]'
                : 'bg-neutral-900 text-white border border-neutral-800 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]'
                } ${className}`}
            {...props}
        >
            {/* Soft inner glow outline layers */}
            {showInnerGlow && (
                <div
                    className={`absolute inset-0 rounded-full pointer-events-none z-10 ${isLight
                        ? 'shadow-[inset_0_0_8px_rgba(0,0,0,0.15),inset_0_0_16px_rgba(0,0,0,0.08),inset_0_0_24px_rgba(0,0,0,0.04)]'
                        : 'shadow-[inset_0_0_12px_rgba(255,255,255,0.4),inset_0_0_24px_rgba(255,255,255,0.2),inset_0_0_36px_rgba(255,255,255,0.1)]'
                        }`}
                />
            )}
            
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out z-0"
                style={{
                    opacity: isLight ? opacity * 0.4 : opacity,
                    background: 'linear-gradient(to right, rgba(31, 58, 147, 0.8), rgba(251, 146, 60, 0.8))',
                    WebkitMaskImage: `radial-gradient(150px circle at ${position.x}px ${position.y}px, black 10%, transparent 100%)`,
                    maskImage: `radial-gradient(150px circle at ${position.x}px ${position.y}px, black 10%, transparent 100%)`,
                    filter: 'blur(2px)'
                }}
            />
            <span className="relative z-20">{children}</span>
        </button>
    );
};

export default SpotlightButton;
