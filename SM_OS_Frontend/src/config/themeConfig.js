// Theme color configurations for light and dark modes
export const themeConfig = {
    light: {
        // Background colors
        bg: {
            primary: 'bg-white',
            secondary: 'bg-gray-50',
            tertiary: 'bg-gray-100',
            card: 'bg-white',
            hover: 'hover:bg-gray-100'
        },
        // Text colors
        text: {
            primary: 'text-gray-900',
            secondary: 'text-gray-600',
            tertiary: 'text-gray-500',
            light: 'text-gray-400'
        },
        // Border colors
        border: {
            primary: 'border-gray-200',
            secondary: 'border-gray-300'
        },
        // Accent colors
        accent: {
            button: 'bg-blue-600 hover:bg-blue-700',
            buttonText: 'text-white',
            highlight: 'text-cyan-600',
            highlight_bg: 'bg-cyan-50'
        },
        // Component specific
        sidebar: 'bg-white',
        sidebarText: 'text-gray-900',
        sidebarHover: 'hover:bg-gray-100',
        modal: 'bg-white',
        input: 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
    },
    dark: {
        // Background colors
        bg: {
            primary: 'bg-slate-900',
            secondary: 'bg-slate-800',
            tertiary: 'bg-slate-700',
            card: 'bg-slate-800/80',
            hover: 'hover:bg-slate-700'
        },
        // Text colors
        text: {
            primary: 'text-white',
            secondary: 'text-gray-300',
            tertiary: 'text-gray-400',
            light: 'text-gray-500'
        },
        // Border colors
        border: {
            primary: 'border-teal-700',
            secondary: 'border-teal-600'
        },
        // Accent colors
        accent: {
            button: 'bg-teal-600 hover:bg-teal-700',
            buttonText: 'text-white',
            highlight: 'text-cyan-400',
            highlight_bg: 'bg-teal-900/50'
        },
        // Component specific
        sidebar: 'bg-slate-900',
        sidebarText: 'text-white',
        sidebarHover: 'hover:bg-slate-800',
        modal: 'bg-gradient-to-br from-teal-900 to-cyan-900',
        input: 'bg-teal-800/50 border border-teal-600 text-white placeholder-teal-400 focus:border-cyan-400'
    }
};
