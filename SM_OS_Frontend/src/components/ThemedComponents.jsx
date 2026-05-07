import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { getComponentTheme } from '../utils/themeUtils';

export const ThemedButton = ({ onClick, className, children, variant = 'primary', ...props }) => {
    const { isDarkMode } = useTheme();
    const theme = getComponentTheme(isDarkMode);
    
    let buttonClass;
    if (variant === 'primary') {
        buttonClass = `${theme.buttonPrimary} text-white`;
    } else if (variant === 'secondary') {
        buttonClass = `border ${theme.buttonSecondary}`;
    }
    
    return (
        <button className={`${buttonClass} ${className || ''}`} onClick={onClick} {...props}>
            {children}
        </button>
    );
};

export const ThemedInput = ({ className, ...props }) => {
    const { isDarkMode } = useTheme();
    const theme = getComponentTheme(isDarkMode);
    
    const inputClass = `${theme.inputBg} ${theme.inputBorder} ${theme.inputText} ${theme.inputPlaceholder} ${theme.focusBorder} border rounded-xl px-4 py-3 outline-none transition-colors`;
    
    return <input className={`${inputClass} ${className || ''}`} {...props} />;
};

export const ThemedSelect = ({ options, className, ...props }) => {
    const { isDarkMode } = useTheme();
    const theme = getComponentTheme(isDarkMode);
    
    const selectClass = `${theme.inputBg} ${theme.inputBorder} ${theme.inputText} ${theme.focusBorder} border rounded-xl px-4 py-3 outline-none transition-colors appearance-none cursor-pointer`;
    
    return (
        <select className={`${selectClass} ${className || ''}`} {...props}>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
};
