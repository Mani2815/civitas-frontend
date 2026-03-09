const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
    const baseStyles = "btn";

    const variants = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        danger: "bg-error text-white hover:bg-red-700 focus:ring-error", // Ad-hoc fallback for danger using new tokens
        outline: "btn-outline",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary",
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

export default Button;
