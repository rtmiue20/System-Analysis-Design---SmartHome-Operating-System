import React from 'react';
import { Bell, Home, Moon, PowerOff, Lightbulb, Thermostat, Speaker, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                        <Home size={20} />
                    </div>
                    <h1 className="text-xl font-bold">Nhà Thông Minh</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100">
                        <Bell size={20} className="text-gray-600" />
                    </button>
                    <img
                        src="https://i.pravatar.cc/150?img=11"
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full border-2 border-orange-200"
                    />
                </div>
            </header>

            {/* Greeting Section */}
            <section className="mb-8">
                <h2 className="text-4xl font-extrabold mb-2">Chào buổi sáng!</h2>
                <div className="flex items-center text-sm text-gray-500 gap-4">
                    <span>🕒 10:30 AM</span>
                    <span>🌡️ 24°C Trong nhà</span>
                    <span>💧 50% Độ ẩm</span>
                </div>
            </section>

            {/* Quick Scenes */}
            <section className="mb-10">
                <h3 className="text-lg font-bold mb-4">Ngữ cảnh nhanh</h3>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-full font-medium shadow-md shadow-orange-200">
                        <Home size={18} /> Về nhà
                    </button>
                    <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full font-medium hover:bg-gray-300">
                        <Moon size={18} /> Ngủ
                    </button>
                    <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full font-medium hover:bg-gray-300">
                        <PowerOff size={18} /> Tắt hết đèn
                    </button>
                </div>
            </section>

            {/* Active Devices */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Thiết bị đang hoạt động (3)</h3>
                    <a href="#" className="text-orange-500 text-sm font-medium hover:underline">Xem tất cả</a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card Đèn trần */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100 flex flex-col justify-between h-32 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                                <Lightbulb size={24} />
                            </div>
                            {/* Toggle Switch Fake */}
                            <div className="w-12 h-6 bg-orange-500 rounded-full flex items-center p-1 justify-end cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Đèn trần</h4>
                            <p className="text-xs text-gray-400">Phòng khách</p>
                        </div>
                    </div>

                    {/* Card Điều hòa */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100 flex flex-col justify-between h-32 relative">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                                <Thermostat size={24} />
                            </div>
                            <div className="w-12 h-6 bg-orange-500 rounded-full flex items-center p-1 justify-end cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Điều hoà</h4>
                            <p className="text-xs text-gray-400">Phòng ngủ chính • 22°C</p>
                        </div>
                    </div>

                    {/* Card Loa */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100 flex flex-col justify-between h-32 relative">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                                <Speaker size={24} />
                            </div>
                            <div className="w-12 h-6 bg-orange-500 rounded-full flex items-center p-1 justify-end cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Loa thông minh</h4>
                            <p className="text-xs text-gray-400">Phòng khách • Đang phát</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Areas Section */}
            <section>
                <h3 className="text-lg font-bold mb-4">Khu vực</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Card Phòng Khách */}
                    <div className="relative h-40 rounded-3xl overflow-hidden group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Phòng khách" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                            <div className="text-white">
                                <h4 className="font-bold text-xl">Phòng khách</h4>
                                <p className="text-sm opacity-80">4 Thiết bị đang bật</p>
                            </div>
                            <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Card Phòng Bếp */}
                    <div className="relative h-40 rounded-3xl overflow-hidden group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Phòng bếp" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                            <div className="text-white">
                                <h4 className="font-bold text-xl">Phòng bếp</h4>
                                <p className="text-sm opacity-80">1 Thiết bị đang bật</p>
                            </div>
                            <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Dashboard;