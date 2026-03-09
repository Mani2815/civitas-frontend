import { motion } from 'framer-motion';

const NeonButton = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
    const baseStyles = "relative px-6 py-3 rounded-lg font-bold tracking-wider uppercase transition-all duration-300 overflow-hidden group";

    const variants = {
        primary: "bg-neon-blue text-white hover:bg-neon-cyan hover:text-navy-900 border border-neon-blue hover:border-neon-cyan shadow-[0_0_10px_rgba(0,102,255,0.5)] hover:shadow-[0_0_20px_rgba(0,243,255,0.8)]",
        secondary: "bg-transparent text-neon-cyan border border-neon-cyan hover:bg-neon-cyan/10 shadow-[0_0_5px_rgba(0,243,255,0.3)] hover:shadow-[0_0_15px_rgba(0,243,255,0.5)]",
        danger: "bg-transparent text-severity-critical border border-severity-critical hover:bg-severity-critical/10 shadow-[0_0_5px_rgba(255,0,85,0.3)] hover:shadow-[0_0_15px_rgba(255,0,85,0.5)]",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span className="relative z-10">{children}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
        </motion.button>
    );
};

export default NeonButton;
