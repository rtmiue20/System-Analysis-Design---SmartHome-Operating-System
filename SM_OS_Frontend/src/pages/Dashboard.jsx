/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, Home, Moon, PowerOff, Lightbulb, Snowflake, Speaker, ChevronRight, Zap, Clock, MapPin } from 'lucide-react';

const Dashboard = () => {
    // 1. Khai báo các State
    const [rooms, setRooms] = useState([]);
    const [devices, setDevices] = useState([]);
    const [scenes, setScenes] = useState([]);
    const [automations, setAutomations] = useState([]);
    const [schedules, setSchedules] = useState([]);

    // Quản lý thời gian, theme và câu chào
    const [currentDate, setCurrentDate] = useState(new Date());
    const [location, setLocation] = useState("Đang lấy vị trí...");

    // Quản lý thông báo (Toast messages)
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

    // Xác định thời gian, theme và câu chào
    const hour = currentDate.getHours();
    const isDarkMode = hour >= 18 || hour < 6; // Từ 18h tối đến 6h sáng là Dark Mode

    let greeting = "Chào buổi sáng!";
    if (hour >= 12 && hour < 18) greeting = "Chào buổi chiều!";
    else if (hour >= 18 || hour < 5) greeting = "Chào buổi tối!";

    const currentTimeString = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    // Cổng API Backend
    const API_BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    const getAuthHeaders = useCallback(() => {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    }, [token]);

    // Hàm thêm thông báo mới
    const addNotification = (message) => {
        const newNotif = { id: Date.now(), message, time: new Date() };
        setNotifications(prev => [newNotif, ...prev].slice(0, 15)); // Lưu tối đa 15 thông báo gần nhất
    };

    // 2. Lấy dữ liệu vị trí
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    const city = data.address.city || data.address.state || data.address.country || "Chưa rõ vị trí";
                    setLocation(city);
                } catch (error) {
                    setLocation("Không thể xác định vị trí");
                }
            }, () => {
                setLocation("Đã từ chối quyền vị trí");
            });
        } else {
            setLocation("Trình duyệt không hỗ trợ");
        }
    }, []);

    // 3. Fetch dữ liệu từ API
    const fetchDashboardData = useCallback(async () => {
        try {
            const requestOptions = { method: 'GET', headers: getAuthHeaders() };

            const [roomsRes, devicesRes, scenesRes, automationsRes, schedulesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/Rooms`, requestOptions),
                fetch(`${API_BASE_URL}/Devices`, requestOptions),
                fetch(`${API_BASE_URL}/Scenes`, requestOptions),
                fetch(`${API_BASE_URL}/Automations`, requestOptions),
                fetch(`${API_BASE_URL}/Schedules`, requestOptions)
            ]);

            if (roomsRes.ok) setRooms(await roomsRes.json());
            if (devicesRes.ok) setDevices(await devicesRes.json());
            if (scenesRes.ok) setScenes(await scenesRes.json());
            if (automationsRes.ok) setAutomations(await automationsRes.json());
            if (schedulesRes.ok) setSchedules(await schedulesRes.json());

        } catch (error) {
            console.error("Lỗi kết nối đến Backend:", error);
        }
    }, [getAuthHeaders]);

    // 4. Quản lý interval thời gian & click outside (đóng thông báo)
    useEffect(() => {
        fetchDashboardData();
        const timer = setInterval(() => setCurrentDate(new Date()), 60000); // Cập nhật mỗi phút

        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            clearInterval(timer);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [fetchDashboardData]);

    // 5. Các hàm xử lý tương tác
    const handleToggleDevice = (id, currentStatus) => {
        const newStatus = currentStatus === "On" ? "Off" : "On";

        // CHỈ CẬP NHẬT UI (KHÔNG LƯU DB NỮA THEO YÊU CẦU)
        setDevices(prevDevices => prevDevices.map(device => {
            const deviceId = device.deviceId || device.id || device.DeviceId || device.Id;
            if (deviceId === id) {
                const deviceName = device.name || device.Name || "Thiết bị";
                addNotification(`Đã ${newStatus === "On" ? "bật" : "tắt"} thiết bị: ${deviceName}`);
                return { ...device, status: newStatus, Status: newStatus };
            }
            return device;
        }));
    };

    const handleExecuteScene = async (scene) => {
        const sceneId = scene.sceneId || scene.id || scene.SceneId || scene.Id;
        const sceneName = scene.name || scene.Name || "Ngữ cảnh";
        addNotification(`Đã kích hoạt ngữ cảnh: ${sceneName}`);

        // OPTIMISTIC UPDATE: Đồng bộ ngay lập tức thiết bị bên dưới mà không delay
        const sceneActions = scene.actions || scene.Actions;
        if (sceneActions && Array.isArray(sceneActions)) {
            setDevices(prevDevices => prevDevices.map(device => {
                const actionForDevice = sceneActions.find(a =>
                    (a.deviceId || a.DeviceId) === (device.deviceId || device.id || device.DeviceId || device.Id)
                );
                return actionForDevice ? { ...device, status: actionForDevice.status || actionForDevice.Status, Status: actionForDevice.status || actionForDevice.Status } : device;
            }));
        }

        try {
            await fetch(`${API_BASE_URL}/Scenes/${sceneId}/execute`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            // Fetch lại dữ liệu mới nhất
            fetchDashboardData();
        } catch (error) {
            console.error("Lỗi khi chạy ngữ cảnh:", error);
            fetchDashboardData();
        }
    };

    const handleToggleAutomation = async (rule) => {
        const ruleId = rule.id || rule.Id;
        const ruleName = rule.name || rule.Name || "Quy tắc";
        const currentActive = rule.isActive !== undefined ? rule.isActive : rule.IsActive;
        const updatedRule = { ...rule, isActive: !currentActive, IsActive: !currentActive };

        setAutomations(prev => prev.map(a => (a.id || a.Id) === ruleId ? updatedRule : a));
        addNotification(`Đã ${!currentActive ? 'bật' : 'tắt'} tự động hóa: ${ruleName}`);

        try {
            await fetch(`${API_BASE_URL}/Automations/${ruleId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updatedRule)
            });
        } catch (error) {
            fetchDashboardData();
        }
    };

    const handleToggleSchedule = async (schedule) => {
        const schedId = schedule.id || schedule.Id;
        const currentActive = schedule.isActive !== undefined ? schedule.isActive : schedule.IsActive;
        const updatedSchedule = { ...schedule, isActive: !currentActive, IsActive: !currentActive };

        setSchedules(prev => prev.map(s => (s.id || s.Id) === schedId ? updatedSchedule : s));

        const deviceMatch = devices.find(d => (d.deviceId || d.id || d.DeviceId || d.Id) === (schedule.smartDeviceId || schedule.SmartDeviceId));
        const deviceName = deviceMatch?.name || deviceMatch?.Name || "Thiết bị";
        addNotification(`Đã ${!currentActive ? 'bật' : 'tắt'} lịch trình cho: ${deviceName}`);

        try {
            await fetch(`${API_BASE_URL}/Schedules/${schedId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updatedSchedule)
            });
        } catch (error) {
            fetchDashboardData();
        }
    };

    // Hàm tiện ích
    const getSceneIcon = (name) => {
        const lowerName = name?.toLowerCase() || '';
        if (lowerName.includes('ngủ') || lowerName.includes('đêm')) return <Moon size={20} />;
        if (lowerName.includes('tắt')) return <PowerOff size={20} />;
        return <Home size={20} />;
    };

    const getDeviceIcon = (type, isOn) => {
        const colorClass = isOn ? "text-orange-500" : (isDarkMode ? "text-gray-500" : "text-gray-400");
        const lowerType = type?.toLowerCase() || '';
        if (lowerType.includes('light') || lowerType.includes('đèn')) return <Lightbulb size={28} className={colorClass} />;
        if (lowerType.includes('airconditioner') || lowerType.includes('thermostat') || lowerType.includes('điều hòa')) return <Snowflake size={28} className={colorClass} />;
        return <Speaker size={28} className={colorClass} />;
    };

    const formatTimeOnly = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const roomImages = [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ];

    const activeDevices = devices.filter(d => d.status === "On" || d.Status === "On");

    // Lớp màu chủ đề
    const mainBgClass = isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800";
    const headerTextClass = isDarkMode ? "text-white" : "text-gray-900";
    const subTextClass = isDarkMode ? "text-gray-400" : "text-gray-500";
    const cardBgClass = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-200";
    const sceneInactiveBg = isDarkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200";

    // 6. Render UI
    return (
        <div className={`min-h-screen font-sans transition-colors duration-500 ${mainBgClass}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-8">

                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-md">
                            <Home size={24} />
                        </div>
                        <h1 className={`text-2xl font-bold tracking-tight ${headerTextClass}`}>Nhà Thông Minh</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Khu vực thông báo (Bell Icon) */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-2 rounded-full transition-colors relative ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <Bell size={24} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>

                            {/* Dropdown thông báo */}
                            {showNotifications && (
                                <div className={`absolute right-0 mt-3 w-80 shadow-2xl rounded-2xl z-50 overflow-hidden border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                    <div className={`px-4 py-3 border-b font-bold ${isDarkMode ? 'border-gray-700 text-white' : 'border-gray-100 text-gray-900'}`}>
                                        Thông báo hệ thống
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <div key={notif.id} className={`px-4 py-3 border-b text-sm ${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-50 text-gray-700'}`}>
                                                    <p>{notif.message}</p>
                                                    <span className="text-xs opacity-60 mt-1 block">
                                                        {notif.time.toLocaleTimeString('vi-VN')}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="px-4 py-6 text-center text-sm opacity-60">Chưa có thông báo nào</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-12 h-12 rounded-full border-[3px] border-orange-100 object-cover" />
                    </div>
                </header>

                <section className="mb-14">
                    <h2 className={`text-5xl font-extrabold mb-4 tracking-tight transition-colors ${headerTextClass}`}>
                        {greeting}
                    </h2>
                    <div className={`flex items-center text-base gap-4 md:gap-6 font-medium flex-wrap ${subTextClass}`}>
                        <span className="flex items-center gap-2"><Clock size={18} /> {currentTimeString}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-400 hidden md:block"></span>
                        <span className="flex items-center gap-2"><MapPin size={18} /> {location}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-400 hidden md:block"></span>
                        <span className="flex items-center gap-2">🌡️ 24°C Trong nhà</span>
                        <span className="w-1 h-1 rounded-full bg-gray-400 hidden md:block"></span>
                        <span className="flex items-center gap-2">💧 50% Độ ẩm</span>
                    </div>
                </section>

                {/* NGỮ CẢNH */}
                <section className="mb-16">
                    <h3 className={`text-xl font-bold mb-6 ${headerTextClass}`}>Ngữ cảnh nhanh</h3>
                    <div className="flex gap-4 flex-wrap">
                        {scenes.length > 0 ? (
                            scenes.map((scene, index) => {
                                const sId = scene.sceneId || scene.id || scene.SceneId || scene.Id;
                                const sceneName = scene.name || scene.Name || "Ngữ cảnh";
                                return (
                                    <button
                                        key={sId || index}
                                        onClick={() => handleExecuteScene(scene)}
                                        className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-semibold transition-all duration-200 transform ${index === 0
                                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600"
                                            : sceneInactiveBg
                                            }`}
                                    >
                                        {getSceneIcon(sceneName)} {sceneName}
                                    </button>
                                );
                            })
                        ) : (
                            <p className="text-gray-400 italic">Chưa có ngữ cảnh nào được thiết lập.</p>
                        )}
                    </div>
                </section>

                {/* THIẾT BỊ ĐANG HOẠT ĐỘNG */}
                <section className="mb-16">
                    <div className="flex justify-between items-end mb-6">
                        <h3 className={`text-xl font-bold ${headerTextClass}`}>Thiết bị đang hoạt động ({activeDevices.length})</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {activeDevices.length > 0 ? (
                            activeDevices.map((device) => {
                                const dId = device.deviceId || device.id || device.DeviceId || device.Id;
                                const dName = device.name || device.Name || "Thiết bị";
                                const dType = device.type || device.Type;
                                const dStatus = device.status || device.Status;

                                const roomMatch = rooms.find(r => (r.roomId || r.id || r.RoomId || r.Id) === (device.roomId || device.RoomId));
                                const roomNameText = roomMatch?.name || roomMatch?.Name || "Chưa phân phòng";

                                return (
                                    <div key={dId} className={`p-6 rounded-3xl border shadow-sm hover:shadow-md flex flex-col justify-between h-40 relative transition-all duration-300 ${cardBgClass}`}>
                                        <div className="flex justify-between items-start">
                                            <div className="w-12 h-12 flex items-center justify-start">
                                                {getDeviceIcon(dType, true)}
                                            </div>
                                            <div onClick={() => handleToggleDevice(dId, dStatus)} className="w-14 h-7 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ease-in-out bg-orange-500 justify-end">
                                                <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-lg ${headerTextClass}`}>{dName}</h4>
                                            <p className={`text-sm font-medium mt-1 ${subTextClass}`}>
                                                {roomNameText} {device.temperature && `• ${device.temperature}°C`}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-400 italic">Không có thiết bị nào đang bật.</p>
                        )}
                    </div>
                </section>

                {/* LỊCH TRÌNH VÀ TỰ ĐỘNG HÓA */}
                <section className="mb-16">
                    <h3 className={`text-xl font-bold mb-6 ${headerTextClass}`}>Thông minh & Lịch trình</h3>

                    {automations.length === 0 && schedules.length === 0 ? (
                        <p className="text-gray-400 italic">Chưa có lịch trình hay tự động hóa nào.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Lịch trình (Schedules) */}
                            {schedules.map(sched => {
                                const deviceMatch = devices.find(d => (d.deviceId || d.id || d.DeviceId || d.Id) === (sched.smartDeviceId || sched.SmartDeviceId));
                                const deviceName = deviceMatch?.name || deviceMatch?.Name || "Thiết bị";
                                const isActiveCard = sched.isActive !== undefined ? sched.isActive : sched.IsActive;
                                const action = sched.action || sched.Action;
                                const schedTime = sched.scheduledTime || sched.ScheduledTime;
                                const schedBg = isDarkMode ? (isActiveCard ? 'border-purple-500/50 bg-gray-800' : 'border-gray-700 bg-gray-900') : (isActiveCard ? 'border-purple-200 bg-white' : 'border-gray-100 bg-gray-50/50');

                                return (
                                    <div key={`sched-${sched.id || sched.Id}`} className={`p-6 rounded-3xl border flex flex-col justify-between h-40 relative transition-all duration-300 ${schedBg}`}>
                                        <div className="flex justify-between items-start">
                                            <div className={`w-12 h-12 flex items-center justify-start ${isActiveCard ? 'text-purple-500' : 'text-gray-400'}`}>
                                                <Clock size={28} />
                                            </div>
                                            <div onClick={() => handleToggleSchedule(sched)} className={`w-14 h-7 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ease-in-out ${isActiveCard ? 'bg-purple-500 justify-end' : (isDarkMode ? 'bg-gray-600 justify-start' : 'bg-gray-300 justify-start')}`}>
                                                <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-lg ${headerTextClass}`}>{deviceName} {action === "On" ? "Bật" : "Tắt"}</h4>
                                            <p className={`text-sm font-medium mt-1 ${subTextClass}`}>Lúc {formatTimeOnly(schedTime)}</p>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Tự động hóa (Automations) */}
                            {automations.map(auto => {
                                const isActiveCard = auto.isActive !== undefined ? auto.isActive : auto.IsActive;
                                const autoName = auto.name || auto.Name;
                                const autoBg = isDarkMode ? (isActiveCard ? 'border-blue-500/50 bg-gray-800' : 'border-gray-700 bg-gray-900') : (isActiveCard ? 'border-blue-200 bg-white' : 'border-gray-100 bg-gray-50/50');

                                return (
                                    <div key={`auto-${auto.id || auto.Id}`} className={`p-6 rounded-3xl border flex flex-col justify-between h-40 relative transition-all duration-300 ${autoBg}`}>
                                        <div className="flex justify-between items-start">
                                            <div className={`w-12 h-12 flex items-center justify-start ${isActiveCard ? 'text-blue-500' : 'text-gray-400'}`}>
                                                <Zap size={28} />
                                            </div>
                                            <div onClick={() => handleToggleAutomation(auto)} className={`w-14 h-7 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ease-in-out ${isActiveCard ? 'bg-blue-500 justify-end' : (isDarkMode ? 'bg-gray-600 justify-start' : 'bg-gray-300 justify-start')}`}>
                                                <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-lg truncate ${headerTextClass}`} title={autoName}>{autoName}</h4>
                                            <p className={`text-sm font-medium mt-1 ${subTextClass}`}>Tự động hóa</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* KHU VỰC / PHÒNG */}
                <section className="pb-16">
                    <h3 className={`text-xl font-bold mb-6 ${headerTextClass}`}>Khu vực</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {rooms.length > 0 ? (
                            rooms.map((room, index) => {
                                const rId = room.roomId || room.id || room.RoomId || room.Id;
                                const roomNameText = room.name || room.Name || `Phòng ${index + 1}`;

                                const activeCount = devices.filter(d => (d.roomId || d.RoomId) === rId && (d.status === "On" || d.Status === "On")).length;
                                const allOff = activeCount === 0;

                                return (
                                    <div key={rId} className="relative h-60 rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-shadow">
                                        <img src={roomImages[index % roomImages.length]} alt={roomNameText} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                        <div className="absolute top-5 left-5 bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/20 shadow-sm">
                                            <span className="text-white font-bold text-lg tracking-wide">{roomNameText}</span>
                                        </div>

                                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                            <div className="text-white">
                                                <h4 className="font-bold text-2xl tracking-wide">{roomNameText}</h4>
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