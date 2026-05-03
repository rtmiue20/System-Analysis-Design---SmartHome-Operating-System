/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Home, Moon, PowerOff, Lightbulb, Snowflake, Speaker, ChevronRight, Thermometer } from 'lucide-react';

const Dashboard = () => {
    // 1. Khai báo các State
    const [rooms, setRooms] = useState([]);
    const [devices, setDevices] = useState([]);
    const [scenes, setScenes] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

    const userId = 1;
    // ĐỔI PORT Ở ĐÂY NẾU BACKEND CỦA BẠN CHẠY CỔNG KHÁC (ví dụ: 5123, 7123...)
    const API_BASE_URL = 'http://localhost:5000/api';

    // 2. Fetch dữ liệu từ API
    const fetchDashboardData = useCallback(async () => {
        try {
            const [roomsRes, devicesRes, scenesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/Rooms`),
                fetch(`${API_BASE_URL}/Devices`), // Hoặc /SmartDevices tùy route C# của bạn
                fetch(`${API_BASE_URL}/Scenes/user/${userId}`)
            ]);

            if (roomsRes.ok) setRooms(await roomsRes.json());
            if (devicesRes.ok) setDevices(await devicesRes.json());
            if (scenesRes.ok) setScenes(await scenesRes.json());
        } catch (error) {
            console.error("Lỗi kết nối đến Backend (Kiểm tra lại Port hoặc CORS):", error);
        }
    }, [userId]);

    // 3. Quản lý thời gian và gọi dữ liệu lần đầu
    useEffect(() => {
        fetchDashboardData();
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        }, 60000);
        return () => clearInterval(timer);
    }, [fetchDashboardData]);

    // 4. Các hàm xử lý tương tác
    const handleToggleDevice = async (id, currentStatus) => {
        const newStatus = currentStatus === "On" ? "Off" : "On";

        // Cập nhật UI ngay lập tức (Hỗ trợ cả deviceId và id)
        setDevices(prevDevices =>
            prevDevices.map(device =>
                (device.deviceId === id || device.id === id) ? { ...device, status: newStatus } : device
            )
        );

        try {
            await fetch(`${API_BASE_URL}/Devices/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStatus)
            });
        } catch (error) {
            console.error("Lỗi khi cập nhật thiết bị:", error);
            fetchDashboardData();
        }
    };

    const handleExecuteScene = async (sceneId) => {
        try {
            await fetch(`${API_BASE_URL}/Scenes/${sceneId}/execute`, {
                method: 'POST'
            });
            fetchDashboardData();
            alert("Đã kích hoạt ngữ cảnh thành công!");
        } catch (error) {
            console.error("Lỗi khi chạy ngữ cảnh:", error);
        }
    };

    const getSceneIcon = (name) => {
        const lowerName = name?.toLowerCase() || '';
        if (lowerName.includes('ngủ')) return <Moon size={20} />;
        if (lowerName.includes('tắt')) return <PowerOff size={20} />;
        return <Home size={20} />;
    };

    const getDeviceIcon = (type, isOn) => {
        const colorClass = isOn ? "text-orange-500" : "text-gray-400";
        switch (type) {
            case 'Light': return <Lightbulb size={28} className={colorClass} />;
            case 'AirConditioner':
            case 'Thermostat': return <Snowflake size={28} className={colorClass} />;
            default: return <Speaker size={28} className={colorClass} />;
        }
    };

    const roomImages = [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ];

    const activeDevicesCount = devices.filter(d => d.status === "On").length;

    // 5. Render UI
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-8">

                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-md">
                            <Home size={24} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Nhà Thông Minh</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                            <Bell size={24} />
                        </button>
                        <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-12 h-12 rounded-full border-[3px] border-orange-100 object-cover" />
                    </div>
                </header>

                <section className="mb-14">
                    <h2 className="text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">Chào buổi sáng!</h2>
                    <div className="flex items-center text-base text-gray-500 gap-6 font-medium">
                        <span className="flex items-center gap-2">🕒 {currentTime}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="flex items-center gap-2">🌡️ 24°C Trong nhà</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="flex items-center gap-2">💧 50% Độ ẩm</span>
                    </div>
                </section>

                <section className="mb-16">
                    <h3 className="text-xl font-bold mb-6 text-gray-900">Ngữ cảnh nhanh</h3>
                    <div className="flex gap-4 flex-wrap">
                        {scenes.length > 0 ? (
                            scenes.map((scene, index) => {
                                const sId = scene.sceneId || scene.id; // Fix lỗi ID
                                return (
                                    <button
                                        key={sId || index}
                                        onClick={() => handleExecuteScene(sId)}
                                        className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-semibold transition-all duration-200 ${index === 0
                                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {getSceneIcon(scene.name)} {scene.name}
                                    </button>
                                );
                            })
                        ) : (
                            <p className="text-gray-400 italic">Chưa có ngữ cảnh nào được thiết lập.</p>
                        )}
                    </div>
                </section>

                <section className="mb-16">
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Thiết bị đang hoạt động ({activeDevicesCount})</h3>
                        <a href="#" className="text-orange-500 text-sm font-bold hover:text-orange-600 hover:underline">Xem tất cả</a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {devices.length > 0 ? (
                            devices.map((device) => {
                                const dId = device.deviceId || device.id; // Fix lỗi ID
                                const isOn = device.status === "On";
                                // Fix tìm phòng (khớp roomId hoặc id của phòng với roomId của thiết bị)
                                const roomName = rooms.find(r => (r.roomId || r.id) === device.roomId)?.name || "Chưa phân phòng";

                                return (
                                    <div
                                        key={dId}
                                        className={`p-6 rounded-3xl border flex flex-col justify-between h-40 relative transition-all duration-300 ${isOn ? 'border-orange-200 bg-white shadow-sm hover:shadow-md' : 'border-gray-100 bg-gray-50/50'}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="w-12 h-12 flex items-center justify-start">
                                                {getDeviceIcon(device.type, isOn)}
                                            </div>
                                            <div
                                                onClick={() => handleToggleDevice(dId, device.status)}
                                                className={`w-14 h-7 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ease-in-out ${isOn ? 'bg-orange-500 justify-end' : 'bg-gray-300 justify-start'}`}
                                            >
                                                <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{device.name}</h4>
                                            <p className="text-sm text-gray-500 font-medium mt-1">
                                                {roomName} {device.temperature && `• ${device.temperature}°C`}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-400 italic">Không tìm thấy thiết bị.</p>
                        )}
                    </div>
                </section>

                <section className="pb-16">
                    <h3 className="text-xl font-bold mb-6 text-gray-900">Khu vực</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {rooms.length > 0 ? (
                            rooms.map((room, index) => {
                                const rId = room.roomId || room.id; // Fix lỗi ID
                                const activeCount = devices.filter(d => d.roomId === rId && d.status === "On").length;
                                const allOff = activeCount === 0;

                                return (
                                    <div key={rId} className="relative h-60 rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-shadow">
                                        <img
                                            src={roomImages[index % roomImages.length]}
                                            alt={room.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                            <div className="text-white">
                                                <h4 className="font-bold text-2xl tracking-wide">{room.name}</h4>
                                                <p className="text-base font-medium text-gray-200 mt-2 opacity-90">
                                                    {allOff ? "Tất cả đã tắt" : `${activeCount} Thiết bị đang bật`}
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                                <ChevronRight size={24} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-400 italic">Chưa có phòng nào được thiết lập.</p>
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Dashboard;