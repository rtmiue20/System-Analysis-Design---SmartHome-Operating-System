import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Layers, Zap, Settings, LogOut } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useContext(LanguageContext);

    const menuItems = [
        { id: 'dashboard', label: t('menu.dashboard', 'Tổng quan'), icon: LayoutDashboard, path: '/dashboard' },
        { id: 'rooms', label: t('menu.rooms', 'Phòng'), icon: Layers, path: '/rooms' },
        { id: 'automations', label: t('menu.automations', 'Tự động hóa'), icon: Zap, path: '/automations' },
        { id: 'settings', label: t('menu.settings', 'Cài đặt'), icon: Settings, path: '/settings' },
    ];

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* SIDEBAR - Cố định bên trái */}
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

                <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${active
                                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-orange-500'
                                    }`}
                            >
                                <Icon size={22} />
                                <span className="font-semibold">{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-800">
                    <button className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-gray-400 hover:bg-red-900/20 hover:text-red-500 transition-colors">
                        <LogOut size={22} />
                        <span className="font-semibold">{t('menu.logout', 'Đăng xuất')}</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT - Tự động chiếm phần không gian còn lại (đã trừ đi Sidebar 64) */}
            <main className="flex-1 ml-64 min-h-screen">
                {/* Lưu ý: Không dùng ml-64 ở bất kỳ trang con nào bên trong nữa!
                  Chỉ cần dùng class "max-w-4xl mx-auto" ở trang con là nội dung sẽ tự canh giữa cực đẹp.
                */}
                {children}
            </main>
        </div>
    );
};

export default MainLayout;