const Input = ({ label, type = 'text', id, placeholder, value, onChange, icon: Icon, required = false }) => {
    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={id} className="block text-text-secondary text-sm font-medium mb-2">
                    {label} {required && <span className="text-primary">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`input-field ${Icon ? 'pl-10' : ''} text-sm`}
                />
            </div>
        </div>
    );
};

export default Input;
