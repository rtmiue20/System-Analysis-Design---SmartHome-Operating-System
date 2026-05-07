// Helper function to get theme-aware class names
export const getThemeClasses = (theme, colorKey) => {
    const keys = colorKey.split('.');
    let result = theme;
    for (let key of keys) {
        result = result[key];
    }
    return result;
};

// Common component theme classes
export const getComponentTheme = (isDarkMode) => {
    const colors = isDarkMode ? {
        headerText: 'text-white',
        subText: 'text-gray-300',
        cardBg: 'bg-slate-800/80',
        cardBorder: 'border-teal-700',
        buttonPrimary: 'bg-teal-600 hover:bg-teal-700',
        buttonSecondary: 'border-teal-600 text-white hover:bg-teal-800/50',
        timeBg: 'bg-teal-900/50',
        timeText: 'text-teal-300',
        inputBg: 'bg-teal-800/50',
        inputBorder: 'border-teal-600',
        inputText: 'text-white',
        inputPlaceholder: 'placeholder-teal-400',
        focusBorder: 'focus:border-cyan-400'
    } : {
        headerText: 'text-gray-900',
        subText: 'text-gray-600',
        cardBg: 'bg-white',
        cardBorder: 'border-gray-200',
        buttonPrimary: 'bg-blue-600 hover:bg-blue-700',
        buttonSecondary: 'border-gray-300 text-gray-900 hover:bg-gray-100',
        timeBg: 'bg-blue-100',
        timeText: 'text-blue-600',
        inputBg: 'bg-white',
        inputBorder: 'border-gray-300',
        inputText: 'text-gray-900',
        inputPlaceholder: 'placeholder-gray-500',
        focusBorder: 'focus:border-blue-500'
    };
    return colors;
};
