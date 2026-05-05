import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Layers, Zap, Settings, LogOut } from 'lucide-react';

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'rooms', label: 'Phòng', icon: Layers, path: '/rooms' },
        { id: 'automations', label: 'Tự động hóa', icon: Zap, path: '/automations' },
        { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/settings' },
    ];

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* ========== SIDEBAR TRÁI (PERSISTENT) ========== */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-screen left-0 top-0">
                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                            <Home size={24} />
                        </div>
                        <span className="text-xl font-black text-white">Smarthome</span>
                    </div>
                </div>

                {/* Menu */}
                <div className="flex-1 flex flex-col gap-2 p-4">
                    {menuItems.map(item => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                                    active
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

                {/* Logout */}
                <div className="p-4 border-t border-gray-800">
                    <button className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-gray-400 hover:bg-red-900/20 hover:text-red-500 transition-colors">
                        <LogOut size={22} />
                        <span className="font-semibold">Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* ========== CONTENT CHÍNH (Offset bên phải sidebar) ========== */}
            <main className="flex-1 ml-64 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;