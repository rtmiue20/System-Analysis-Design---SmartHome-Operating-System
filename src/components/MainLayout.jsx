import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Layers, Zap, Settings, LogOut, AlertCircle, X } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';
import { ThemeContext } from '../contexts/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useContext(LanguageContext);
    const { isDarkMode } = useContext(ThemeContext);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const menuItems = [
        { id: 'dashboard', label: t('menu.dashboard'), icon: LayoutDashboard, path: '/dashboard' },
        { id: 'rooms', label: t('menu.rooms'), icon: Layers, path: '/rooms' },
        { id: 'automations', label: t('menu.automations'), icon: Zap, path: '/automations' },
        { id: 'settings', label: t('menu.settings'), icon: Settings, path: '/settings' },
    ];

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            localStorage.removeItem('token');
            setTimeout(() => {
                navigate('/login');
            }, 300);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    // ==================== LOGOUT MODAL ====================
    const LogoutModal = () => (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                <div className="flex flex-col items-center pt-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                </div>

                <div className="p-6 text-center">
                    <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('menu.logout')}
                    </h2>
                    <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        {t('common.logout_confirm', 'Are you sure you want to logout from the system? Your session will end immediately.')}
                    </p>
                </div>

                <div className={`flex gap-3 p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                    <button
                        onClick={() => setShowLogoutModal(false)}
                        disabled={isLoggingOut}
                        className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors ${isDarkMode
                            ? 'bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50'
                            }`}
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex-1 px-4 py-3 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                        {isLoggingOut ? t('common.loading') : t('menu.logout')}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* SIDEBAR */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-screen left-0 top-0 z-40">
                <div className="h-20 flex items-center px-8 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Home className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                            SM_OS
                        </span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${active
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 space-y-3">
                    <LanguageSwitcher />
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">{t('menu.logout')}</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-64">
                {children}
            </main>

            {showLogoutModal && <LogoutModal />}
        </div>
    );
};

export default MainLayout;