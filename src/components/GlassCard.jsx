import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hoverEffect = false }) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { scale: 1.02, boxShadow: '0 0 20px rgba(0, 243, 255, 0.2)' } : {}}
            className={`glass-panel rounded-xl p-6 ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
