import React, { createContext, useState, useEffect, useCallback } from 'react';

export const LanguageContext = createContext();

const translations = {
    en: {
        brand: 'Smarthome',
        menu: {
            dashboard: 'Dashboard',
            rooms: 'Rooms',
            automations: 'Automations',
            settings: 'Settings',
            logout: 'Logout'
        },
        settings: {
            title: 'Settings',
            profile: {
                name: 'Alex Mercer',
                email: 'alex.mercer@example.com',
                edit: 'Edit Profile'
            },
            systemPreferences: 'System Preferences',
            language: 'Language',
            languageValue_en: 'English (US)',
            languageValue_vi: 'Vietnamese',
            theme: 'Theme',
            darkMode: 'Dark Mode',
            light: 'Light',
            dark: 'Dark',
            temperatureUnits: 'Temperature Units',
            celsius: 'Celsius (°C)',
            fahrenheit: 'Fahrenheit (°F)',
            notifications: 'Notifications',
            systemAlerts: 'System Alerts',
            deviceStatus: 'Device Status',
            marketingOffers: 'Marketing & Offers',
            securityAccess: 'Security & Access',
            changePassword: 'Change Password',
            twoFactor: 'Two-Factor Auth',
            manageFamily: 'Manage Family',
            systemInfo: 'System Info',
            luminaHub: 'Lumina Core Hub',
            checkForUpdates: 'Check for Updates'
        }
    },
    vi: {
        brand: 'Smarthome',
        menu: {
            dashboard: 'Tổng quan',
            rooms: 'Phòng',
            automations: 'Tự động hóa',
            settings: 'Cài đặt',
            logout: 'Đăng xuất'
        },
        settings: {
            title: 'Giao diện Cài đặt',
            profile: {
                name: 'Alex Mercer',
                email: 'alex.mercer@example.com',
                edit: 'Chỉnh sửa'
            },
            systemPreferences: 'Tùy chọn hệ thống',
            language: 'Ngôn ngữ',
            languageValue_en: 'English (US)',
            languageValue_vi: 'Tiếng Việt',
            theme: 'Giao diện',
            darkMode: 'Chế độ tối',
            light: 'Sáng',
            dark: 'Tối',
            temperatureUnits: 'Đơn vị nhiệt độ',
            celsius: 'Celsius (°C)',
            fahrenheit: 'Fahrenheit (°F)',
            notifications: 'Thông báo',
            systemAlerts: 'Cảnh báo hệ thống',
            deviceStatus: 'Trạng thái thiết bị',
            marketingOffers: 'Khuyến mại & Tin tức',
            securityAccess: 'Bảo mật & Truy cập',
            changePassword: 'Đổi mật khẩu',
            twoFactor: 'Xác thực 2 bước',
            manageFamily: 'Quản lý gia đình',
            systemInfo: 'Thông tin hệ thống',
            luminaHub: 'Lumina Core Hub',
            checkForUpdates: 'Kiểm tra cập nhật'
        }
    }
};

export const LanguageProvider = ({ children }) => {
    const getInitial = () => {
        try {
            const stored = localStorage.getItem('app_lang');
            if (stored === 'en' || stored === 'vi') return stored;
        } catch (e) { /* ignore */ }
        const lang = navigator.language?.startsWith('vi') ? 'vi' : 'en';
        return lang;
    };

    const [lang, setLang] = useState(getInitial);

    useEffect(() => {
        try { localStorage.setItem('app_lang', lang); } catch (e) { }
        document.documentElement.lang = lang === 'vi' ? 'vi' : 'en';
    }, [lang]);

    const t = useCallback(
        (path, fallback = '') => {
            if (!path) return fallback;
            const parts = path.split('.');
            let obj = translations[lang];
            for (const p of parts) {
                if (!obj) return fallback;
                obj = obj[p];
            }
            return obj ?? fallback;
        },
        [lang]
    );

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};