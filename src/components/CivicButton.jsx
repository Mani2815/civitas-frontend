const CivicButton = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
    const baseStyles = "px-4 py-2 font-medium rounded-sm transition-colors text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-civic-navy text-white hover:bg-civic-slate focus:ring-civic-navy",
        secondary: "bg-white border border-surface-300 text-civic-slate hover:bg-surface-50 focus:ring-surface-400",
        danger: "bg-white border border-civic-danger text-civic-danger hover:bg-red-50 focus:ring-civic-danger",
        outline: "bg-transparent border border-civic-navy text-civic-navy hover:bg-surface-100",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default CivicButton;
