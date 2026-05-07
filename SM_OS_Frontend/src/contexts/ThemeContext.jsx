import React, { createContext, useState, useEffect, useCallback } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Determine theme from clock: true = dark, false = light
    const getThemeBasedOnTime = useCallback(() => {
        const currentHour = new Date().getHours();
        // Light mode: 6 AM - 6 PM (6-18) => return false
        // Dark mode: 6 PM - 6 AM (18-6) => return true
        return currentHour >= 18 || currentHour < 6;
    }, []);

    // Look for user override in localStorage ("dark" | "light" | null)
    const getInitial = () => {
        try {
            const override = localStorage.getItem('theme_override');
            if (override === 'dark') return true;
            if (override === 'light') return false;
        } catch (e) { /* ignore storage errors */ }
        return getThemeBasedOnTime();
    };

    const [isDarkMode, setIsDarkMode] = useState(getInitial);

    // Keep automation running in background (updates at boundary)
    useEffect(() => {
        const interval = setInterval(() => {
            // Only auto-update if there is no override
            try {
                const override = localStorage.getItem('theme_override');
                if (!override) {
                    setIsDarkMode(getThemeBasedOnTime());
                }
            } catch (e) { /* ignore */ }
        }, 60_000);
        return () => clearInterval(interval);
    }, [getThemeBasedOnTime]);

    // Apply `dark` class on <html> and data-theme attribute
    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
        }
    }, [isDarkMode]);

    // toggleTheme:
    // - pass true/false to set and persist override
    // - pass null to clear override (resume automation)
    const toggleTheme = (force) => {
        if (force === null) {
            try { localStorage.removeItem('theme_override'); } catch (e) { }
            setIsDarkMode(getThemeBasedOnTime());
            return;
        }
        if (typeof force === 'boolean') {
            try { localStorage.setItem('theme_override', force ? 'dark' : 'light'); } catch (e) { }
            setIsDarkMode(force);
            return;
        }
        // no arg => toggle and persist
        const newVal = !isDarkMode;
        try { localStorage.setItem('theme_override', newVal ? 'dark' : 'light'); } catch (e) { }
        setIsDarkMode(newVal);
    };

    const value = {
        isDarkMode,
        toggleTheme,
        getThemeBasedOnTime,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};