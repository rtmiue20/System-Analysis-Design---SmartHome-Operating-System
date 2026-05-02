/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Home, Moon, PowerOff, Lightbulb, Thermometer, Speaker, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    // 1. Khai báo các State
    const [rooms, setRooms] = useState([]);
    const [devices, setDevices] = useState([]);
    const [scenes, setScenes] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

    const userId = 1;

    // 2. Định nghĩa hàm fetch bằng useCallback (Chuẩn bài ESLint nhất)
    const fetchDashboardData = useCallback(async () => {
        try {
            const [roomsRes, devicesRes, scenesRes] = await Promise.all([
                fetch('http://localhost:5000/api/Rooms'),
                fetch('http://localhost:5000/api/Devices'),
                fetch(`http://localhost:5000/api/Scenes/user/${userId}`)
            ]);

            if (roomsRes.ok) setRooms(await roomsRes.json());
            if (devicesRes.ok) setDevices(await devicesRes.json());
            if (scenesRes.ok) setScenes(await scenesRes.json());
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    }, [userId]); // Chỉ tạo lại hàm này nếu userId thay đổi

    // 3. useEffect gọi API và set đồng hồ
    useEffect(() => {
        fetchDashboardData();

        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        }, 60000);

        return () => clearInterval(timer);
    }, [fetchDashboardData]); // Đưa fetchDashboardData vào mảng dependency để chiều lòng ESLint

    // 4. Các hàm xử lý sự kiện
    const handleToggleDevice = async (id, currentStatus) => {
        const newStatus = currentStatus === "On" ? "Off" : "On";

        setDevices(prevDevices =>
            prevDevices.map(device =>
                device.id === id ? { ...device, status: newStatus } : device
            )
        );

        try {
            await fetch(`http://localhost:5000/api/Devices/${id}/status`, {
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
            await fetch(`http://localhost:5000/api/Scenes/${sceneId}/execute`, {
                method: 'POST'
            });
            fetchDashboardData();
            alert("Đã kích hoạt ngữ cảnh thành công!");
        } catch (error) {
            console.error("Lỗi khi chạy ngữ cảnh:", error);
        }
    };

    const getSceneIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('ngủ')) return <Moon size={18} />;
        if (lowerName.includes('tắt')) return <PowerOff size={18} />;
        return <Home size={18} />;
    };

    const getDeviceIcon = (type) => {
        switch (type) {
            case 'Light': return <Lightbulb size={24} />;
            case 'Thermostat': return <Thermometer size={24} />; 
            default: return <Speaker size={24} />;
        }
    };

    const roomImages = [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ];

    // 5. Render UI
    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
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

            <section className="mb-8">
                <h2 className="text-4xl font-extrabold mb-2">Chào buổi sáng!</h2>
                <div className="flex items-center text-sm text-gray-500 gap-4">
                    <span>🕒 {currentTime}</span>
                    <span>🌡️ 24°C Trong nhà</span>
                    <span>💧 50% Độ ẩm</span>
                </div>
            </section>

            <section className="mb-10">
                <h3 className="text-lg font-bold mb-4">Ngữ cảnh nhanh</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {scenes.length > 0 ? (
                        scenes.map((scene, index) => (
                            <button
                                key={scene.id || index}
                                onClick={() => handleExecuteScene(scene.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap ${index === 0
                                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {getSceneIcon(scene.name)} {scene.name}
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm italic">Chưa có ngữ cảnh nào được thiết lập.</p>
                    )}
                </div>
            </section>

            <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Thiết bị của bạn ({devices.length})</h3>
                    <a href="#" className="text-orange-500 text-sm font-medium hover:underline">Xem tất cả</a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {devices.length > 0 ? (
                        devices.map((device) => {
                            const isOn = device.status === "On";
                            const roomName = rooms.find(r => r.id === device.roomId)?.name || "Chưa phân phòng";

                            return (
                                <div key={device.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden transition-colors hover:border-orange-100">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOn ? 'bg-orange-50 text-orange-500' : 'bg-gray-100 text-gray-400'}`}>
                                            {getDeviceIcon(device.type)}
                                        </div>
                                        <div
                                            onClick={() => handleToggleDevice(device.id, device.status)}
                                            className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${isOn ? 'bg-orange-500 justify-end' : 'bg-gray-300 justify-start'}`}
                                        >
                                            <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{device.name}</h4>
                                        <p className="text-xs text-gray-400">{roomName} {device.temperature && `• ${device.temperature}°C`}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-400 text-sm italic">Không tìm thấy thiết bị.</p>
                    )}
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-4">Khu vực</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rooms.length > 0 ? (
                        rooms.map((room, index) => {
                            const activeCount = devices.filter(d => d.roomId === room.id && d.status === "On").length;

                            return (
                                <div key={room.id} className="relative h-40 rounded-3xl overflow-hidden group cursor-pointer">
                                    <img
                                        src={roomImages[index % roomImages.length]}
                                        alt={room.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                                        <div className="text-white">
                                            <h4 className="font-bold text-xl">{room.name}</h4>
                                            <p className="text-sm opacity-80">{activeCount} Thiết bị đang bật</p>
                                        </div>
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-400 text-sm italic">Chưa có phòng nào được thiết lập.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;