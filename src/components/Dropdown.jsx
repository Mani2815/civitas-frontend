import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi';

const Dropdown = ({ 
    label, 
    name,
    options, 
    value, 
    onChange, 
    placeholder = "Select an option...", 
    icon: Icon,
    itemIcons = {}, // Map of option value to Icon component
    required = false,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt === value || (opt.value && opt.value === value));
    const displayValue = selectedOption 
        ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label)
        : null;

    const handleSelect = (opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        onChange({ target: { name: name || '', value: val } });
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block text-text-secondary text-sm font-medium mb-2">
                    {label} {required && <span className="text-primary">*</span>}
                </label>
            )}
            
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-bg-primary border transition-all duration-300 ${
                    isOpen 
                    ? 'border-primary ring-2 ring-primary/10 shadow-lg' 
                    : 'border-border hover:border-border-dark'
                }`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {/* Selected Icon logic */}
                    {value && itemIcons[value] && (
                        (() => {
                            const { icon: SelectedIcon, className: iconClass, bgClassName } = itemIcons[value];
                            return (
                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${bgClassName} shrink-0`}>
                                    <SelectedIcon className={`w-4 h-4 ${iconClass}`} />
                                </span>
                            );
                        })()
                    )}
                    
                    <span className={`text-sm truncate ${value ? 'text-text-primary' : 'text-text-tertiary'}`}>
                        {displayValue || placeholder}
                    </span>
                </div>
                
                <HiChevronDown 
                    className={`w-5 h-5 text-text-tertiary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-2 bg-bg-primary border border-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden backdrop-blur-xl"
                    >
                        <div className="max-h-60 overflow-y-auto p-2 scroll-smooth">
                            {options.map((opt, index) => {
                                const val = typeof opt === 'string' ? opt : opt.value;
                                const labelText = typeof opt === 'string' ? opt : opt.label;
                                const isSelected = val === value;
                                const IconComp = itemIcons[val];

                                return (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => handleSelect(opt)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                                            isSelected 
                                            ? 'bg-primary/5 text-primary' 
                                            : 'hover:bg-bg-tertiary text-text-secondary hover:text-text-primary'
                                        }`}
                                    >
                                        {IconComp && (
                                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-transform group-hover:scale-110 ${IconComp.bgClassName}`}>
                                                <IconComp.icon className={`w-4 h-4 ${IconComp.className}`} />
                                            </span>
                                        )}
                                        <span className="text-sm font-medium">{labelText}</span>
                                        
                                        {isSelected && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dropdown;
