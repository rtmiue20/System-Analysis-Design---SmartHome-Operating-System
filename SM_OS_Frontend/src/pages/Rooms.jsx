import React, { useState, useEffect, useRef } from 'react';
import { Clock, Plus, Thermometer, Lightbulb, X, ChevronDown, CheckCircle, AlertCircle, Minus, MoreVertical, Home, UtensilsCrossed, Bed, Droplets, Car, Briefcase, Gamepad2, Monitor, Music, Shirt, Wind, SquareX } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { getComponentTheme } from '../utils/themeUtils';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [devices, setDevices] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [showAddRoomModal, setShowAddRoomModal] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomIcon, setNewRoomIcon] = useState('living');
    const [roomMenuOpenId, setRoomMenuOpenId] = useState(null);
    const { isDarkMode } = useTheme();
    const theme = getComponentTheme(isDarkMode);

    const [deviceSettings, setDeviceSettings] = useState({
        temperature: 24,
        mode: 'Làm mát',
        brightness: 100,
        hasSchedule: false,
        scheduleTime: '02:00'
    });

    const [newDevice, setNewDevice] = useState({
        name: '',
        type: 'Light',
        roomId: null
    });

    const [toasts, setToasts] = useState([]);
    const hasInitialized = useRef(false);

    const API_BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    const getAuthHeaders = () => {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    };

    const getRoomId = (room) => room.roomId || room.id || room.RoomId || room.Id;
    const getRoomName = (room) => room.roomName || room.name || room.RoomName || room.Name || 'Phòng';
    const getDeviceId = (device) => device.deviceId || device.id || device.DeviceId || device.Id;
    const getDeviceName = (device) => device.name || device.Name || 'Thiết bị';
    const getDeviceType = (device) => device.type || device.Type || 'Light';

    const deviceTypes = ['Light', 'AC', 'TV', 'Thermostat', 'Curtain', 'Speaker', 'Camera', 'Lock'];
    const modes = ['Làm mát', 'Hút ẩm', 'Quạt'];

    // Lucide icon mapping for rooms - determine icon based on room name if not explicitly set
    const roomIconMap = {
        living: Home,
        bed: Bed,
        kitchen: UtensilsCrossed,
        bath: Droplets,
        garage: Car,
        work: Briefcase,
        game: Gamepad2,
        tv: Monitor,
        music: Music,
        laundry: Shirt,
        wardrobe: Shirt,
        other: SquareX
    };

    const getRoomIconByName = (roomName) => {
        const name = (roomName || '').toLowerCase();

        if (name.includes('phòng khách') || name.includes('living') || name.includes('salon')) return Home;
        if (name.includes('phòng ngủ') || name.includes('bed') || name.includes('master')) return Bed;
        if (name.includes('bếp') || name.includes('kitchen')) return UtensilsCrossed;
        if (name.includes('phòng tắm') || name.includes('bath') || name.includes('wc')) return Droplets;
        if (name.includes('gara') || name.includes('garage') || name.includes('ô tô')) return Car;
        if (name.includes('làm việc') || name.includes('work') || name.includes('office')) return Briefcase;
        if (name.includes('phòng game') || name.includes('game')) return Gamepad2;
        if (name.includes('phòng tv') || name.includes('tv')) return Monitor;
        if (name.includes('âm nhạc') || name.includes('music')) return Music;
        if (name.includes('giặt') || name.includes('laundry')) return Shirt;
        if (name.includes('tủ quần áo') || name.includes('wardrobe')) return Shirt;

        return Home; // default
    };

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [rRes, dRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/Rooms`, { method: 'GET', headers: getAuthHeaders() }),
                    fetch(`${API_BASE_URL}/Devices`, { method: 'GET', headers: getAuthHeaders() })
                ]);

                if (rRes.ok) {
                    const roomsData = await rRes.json();
                    setRooms(roomsData || []);

                    if (!hasInitialized.current && roomsData.length > 0) {
                        const selectedRoomId = localStorage.getItem('selectedRoomId');
                        if (selectedRoomId) {
                            const foundRoom = roomsData.find(r => String(getRoomId(r)) === String(selectedRoomId));
                            if (foundRoom) {
                                setSelectedRoom(foundRoom);
                                localStorage.removeItem('selectedRoomId');
                            } else {
                                setSelectedRoom(roomsData[0]);
                            }
                        } else {
                            setSelectedRoom(roomsData[0]);
                        }
                        hasInitialized.current = true;
                    }
                }
                if (dRes.ok) {
                    setDevices(await dRes.json() || []);
                }
            } catch (e) {
                console.error('Lỗi fetch dữ liệu:', e);
                addToast('Lỗi khi tải dữ liệu', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleToggleDevice = async (deviceId, currentStatus) => {
        const newStatus = currentStatus === "On" ? "Off" : "On";
        setDevices(prev => prev.map(d => {
            const dId = getDeviceId(d);
            if (dId === deviceId) return { ...d, status: newStatus, Status: newStatus };
            return d;
        }));

        try {
            await fetch(`${API_BASE_URL}/Devices/${deviceId}/status`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(newStatus)
            });
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
            addToast('Lỗi khi cập nhật trạng thái thiết bị', 'error');
        }
    };

    const handleOpenDeviceModal = (device) => {
        const dType = getDeviceType(device).toUpperCase();
        // Only allow AC devices to open the modal
        if (!dType.includes('AC')) {
            addToast('Chỉ thiết bị AC mới có thể mở giao diện này', 'error');
            return;
        }

        setSelectedDevice(device);
        setDeviceSettings({
            temperature: device.temperature || 24,
            mode: device.mode || 'Làm mát',
            brightness: device.brightness || 100,
            hasSchedule: device.hasSchedule || false,
            scheduleTime: device.scheduleTime || '02:00'
        });
        setShowDeviceModal(true);
    };

    const handleSaveDeviceSettings = async () => {
        if (!selectedDevice) return;
        try {
            const deviceId = getDeviceId(selectedDevice);
            const updatePayload = {
                ...selectedDevice,
                temperature: deviceSettings.temperature,
                mode: deviceSettings.mode,
                brightness: deviceSettings.brightness,
                hasSchedule: deviceSettings.hasSchedule,
                scheduleTime: deviceSettings.scheduleTime
            };

            const res = await fetch(`${API_BASE_URL}/Devices/${deviceId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updatePayload)
            });

            if (res.ok) {
                setDevices(prev => prev.map(d => getDeviceId(d) === deviceId ? { ...d, ...updatePayload } : d));
                addToast('Đã lưu cài đặt thiết bị thành công!', 'success');
                setShowDeviceModal(false);
            } else {
                addToast('Lỗi khi lưu cài đặt', 'error');
            }
        } catch (error) {
            console.error('Lỗi lưu cài đặt:', error);
            addToast('Lỗi: ' + error.message, 'error');
        }
    };

    const handleAddDevice = async () => {
        if (!newDevice.name.trim()) {
            addToast('Vui lòng nhập tên thiết bị', 'error');
            return;
        }
        if (!selectedRoom) {
            addToast('Vui lòng chọn phòng', 'error');
            return;
        }

        try {
            const devicePayload = {
                name: newDevice.name,
                type: newDevice.type,
                roomId: getRoomId(selectedRoom),
                status: 'Off'
            };

            const res = await fetch(`${API_BASE_URL}/Devices`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(devicePayload)
            });

            if (res.ok) {
                const createdDevice = await res.json();
                setDevices([...devices, createdDevice]);
                setShowAddModal(false);
                setNewDevice({ name: '', type: 'Light', roomId: null });
                addToast('Đã thêm thiết bị thành công!', 'success');
            } else {
                const errorData = await res.json();
                addToast(errorData.message || 'Lỗi khi thêm thiết bị', 'error');
            }
        } catch (error) {
            console.error('Lỗi thêm thiết bị:', error);
            addToast('Lỗi: ' + error.message, 'error');
        }
    };

    const handleCreateRoom = async () => {
        if (!newRoomName.trim()) {
            addToast('Vui lòng nhập tên phòng', 'error');
            return;
        }

        try {
            const payload = {
                name: newRoomName,
                icon: newRoomIcon
            };

            const res = await fetch(`${API_BASE_URL}/Rooms`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const created = await res.json();
                setRooms(prev => [...prev, created]);
                setSelectedRoom(created);
                setShowAddRoomModal(false);
                setNewRoomName('');
                setNewRoomIcon('living');
                addToast('Đã tạo phòng mới!', 'success');
            } else {
                const err = await res.json();
                addToast(err.message || 'Lỗi khi tạo phòng', 'error');
            }
        } catch (error) {
            console.error('Lỗi tạo phòng:', error);
            addToast('Lỗi: ' + error.message, 'error');
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm('Bạn chắc chắn muốn xóa phòng này?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/Rooms/${roomId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (res.ok) {
                setRooms(prev => prev.filter(r => getRoomId(r) !== roomId));
                if (selectedRoom && getRoomId(selectedRoom) === roomId) {
                    setSelectedRoom(rooms.length > 1 ? rooms[0] : null);
                }
                setRoomMenuOpenId(null);
                addToast('Đã xóa phòng thành công!', 'success');
            } else {
                addToast('Lỗi khi xóa phòng', 'error');
            }
        } catch (error) {
            console.error('Lỗi xóa phòng:', error);
            addToast('Lỗi: ' + error.message, 'error');
        }
    };

    const getDeviceIcon = (type, isOn) => {
        const color = isOn ? 'text-orange-500' : 'text-gray-400';
        const lowerType = (type || '').toLowerCase();

        if (lowerType.includes('light') || lowerType.includes('đèn')) {
            return <Lightbulb size={32} className={color} />;
        } else if (lowerType.includes('ac') || lowerType.includes('điều hòa') || lowerType.includes('quạt')) {
            return <Wind size={32} className={color} />;
        } else if (lowerType.includes('tv')) {
            return <Monitor size={32} className={color} />;
        } else if (lowerType.includes('speaker')) {
            return <Music size={32} className={color} />;
        }
        return <Thermometer size={32} className={color} />;
    };

    const getRoomIcon = (iconKey) => {
        const IconComponent = roomIconMap[iconKey] || Home;
        return <IconComponent size={20} />;
    };

    const filteredDevices = selectedRoom
        ? devices.filter(d => {
            const dRoomId = d.roomId || d.RoomId;
            const sRoomId = getRoomId(selectedRoom);
            return String(dRoomId) === String(sRoomId);
        })
        : [];

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Đang tải dữ liệu...</div>;
    }

    return (
        <div className={`p-10 min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            {/* Toast Notifications */}
            <div className="fixed top-6 right-6 z-50 space-y-3">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 ${toast.type === 'success'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                            }`}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle size={20} />
                        ) : (
                            <AlertCircle size={20} />
                        )}
                        <span className="font-semibold">{toast.message}</span>
                    </div>
                ))}
            </div>

            {/* Header */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className={`text-4xl font-black ${theme.headerText}`}>
                        {selectedRoom ? getRoomName(selectedRoom) : 'Chọn phòng'}
                    </h2>
                    <p className={`text-sm ${theme.subText} mt-1`}>
                        {filteredDevices.length} thiết bị
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors shadow-lg`}
                    >
                        <Plus size={20} /> Thêm thiết bị
                    </button>
                    <div className={`${theme.timeBg} px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold ${theme.timeText}`}>
                        <Clock size={18} />
                        {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </header>

            {/* Room list in the sidebar + devices on the right */}
            <div className="flex gap-6">
                {/* Left: Room list */}
                <div className="w-72 flex-shrink-0">
                    {/* House info card */}
                    <div className={`rounded-xl p-4 mb-4 ${isDarkMode ? 'bg-slate-800/60 border border-slate-700' : 'bg-white border border-gray-100'} shadow-sm`}>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md bg-orange-500 flex items-center justify-center text-white">
                                    <Home size={24} />
                                </div>
                                <div>
                                    <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Nhà Thông Minh</div>
                                    <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Quản lý không gian</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAddRoomModal(true)}
                                className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold"
                            >
                                <Plus size={14} /> Thêm phòng mới
                            </button>
                        </div>
                    </div>

                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 uppercase tracking-wide`}>CÁC PHÒNG</h3>
                    <div className="space-y-1">
                        {rooms.map(room => {
                            const rId = getRoomId(room);
                            const rName = getRoomName(room);
                            const isSelected = selectedRoom && String(getRoomId(selectedRoom)) === String(rId);
                            const iconKey = room.icon || room.Icon || 'living';

                            return (
                                <div key={rId} className="relative group">
                                    <button
                                        onClick={() => {
                                            setSelectedRoom(room);
                                            setRoomMenuOpenId(null);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isSelected
                                            ? isDarkMode
                                                ? 'bg-orange-500/15 text-orange-400'
                                                : 'bg-orange-50 text-orange-600'
                                            : isDarkMode
                                                ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {/* Icon box - use name-based icon detection */}
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isSelected
                                            ? isDarkMode ? 'bg-orange-500/25 text-orange-400' : 'bg-orange-100 text-orange-500'
                                            : isDarkMode ? 'bg-white/8 text-gray-400' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {(() => {
                                                const IconComponent = getRoomIconByName(rName);
                                                return <IconComponent size={18} />;
                                            })()}
                                        </span>

                                        <span className="flex-1 text-left truncate">{rName}</span>

                                        {/* 3-dot menu button */}
                                        <span
                                            role="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setRoomMenuOpenId(roomMenuOpenId === rId ? null : rId);
                                            }}
                                            className={`opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all flex-shrink-0 ${roomMenuOpenId === rId ? 'opacity-100' : ''
                                                } ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                                        >
                                            <MoreVertical size={16} />
                                        </span>
                                    </button>

                                    {/* Dropdown menu */}
                                    {roomMenuOpenId === rId && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setRoomMenuOpenId(null)} />
                                            <div className={`absolute right-0 top-full mt-1 z-20 min-w-[150px] rounded-xl shadow-xl overflow-hidden border ${isDarkMode
                                                ? 'bg-gray-800 border-white/10'
                                                : 'bg-white border-gray-200'
                                                }`}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setRoomMenuOpenId(null);
                                                        // TODO: Edit room
                                                    }}
                                                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-white/8' : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                    Chỉnh sửa
                                                </button>
                                                <div className={`h-px ${isDarkMode ? 'bg-white/8' : 'bg-gray-100'}`} />
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteRoom(rId);
                                                    }}
                                                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors text-red-500 ${isDarkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                                                        }`}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                                        <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                                    </svg>
                                                    Xóa phòng
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Device cards */}
                <div className="flex-1">
                    {filteredDevices.length === 0 ? (
                        <div className={`flex items-center justify-center h-96 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <p className="text-lg">Phòng này chưa có thiết bị nào</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                            {filteredDevices.map(device => {
                                const dId = getDeviceId(device);
                                const dName = getDeviceName(device);
                                const dType = getDeviceType(device);
                                const dStatus = device.status || device.Status || 'Off';
                                const isOn = dStatus === 'On' || dStatus === 'on';

                                const temperature = device.temperature || 24;
                                const brightness = device.brightness || 70;

                                let statusText = isOn ? 'Đang hoạt động' : 'Tắt';
                                let extraInfo = '';
                                let showTempControl = false;
                                let showBrightnessBar = false;

                                if (dType.toLowerCase().includes('ac') || dType.toLowerCase().includes('thermostat') || dType.toLowerCase().includes('điều hòa') || dType.toLowerCase().includes('quạt')) {
                                    statusText = isOn ? 'Đang làm mát' : 'Tắt';
                                    extraInfo = `${temperature}°C`;
                                    showTempControl = true;
                                }
                                else if (dType.toLowerCase().includes('light') || dType.toLowerCase().includes('đèn')) {
                                    statusText = isOn ? 'Đang sáng' : 'Tắt';
                                    extraInfo = `${brightness}%`;
                                    showBrightnessBar = isOn;
                                }
                                else if (dType.toLowerCase().includes('tv')) {
                                    statusText = isOn ? 'Đang bật' : 'Tắt';
                                    extraInfo = 'HDMI 1';
                                }
                                else if (dType.toLowerCase().includes('curtain') || dType.toLowerCase().includes('rèm')) {
                                    statusText = isOn ? 'Đang mở' : 'Đang đóng';
                                }

                                return (
                                    <div
                                        key={dId}
                                        onClick={() => handleOpenDeviceModal(device)}
                                        className={`group rounded-2xl transition-all cursor-pointer overflow-hidden
                            ${isDarkMode
                                                ? 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                                                : 'bg-white border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-md'
                                            }`}
                                    >
                                        <div className="p-5">
                                            {/* Header: Icon + Toggle */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                                    ${isOn
                                                        ? 'bg-orange-100 text-orange-500'
                                                        : isDarkMode
                                                            ? 'bg-slate-700 text-slate-400'
                                                            : 'bg-gray-100 text-gray-400'
                                                    }`}>
                                                    {getDeviceIcon(dType, isOn)}
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleDevice(dId, dStatus);
                                                    }}
                                                    className={`relative w-12 h-6 rounded-full transition-colors duration-300
                                        ${isOn ? 'bg-orange-500' : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'}`}
                                                >
                                                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${isOn ? 'translate-x-6' : ''}`} />
                                                </button>
                                            </div>

                                            {/* Device Name & Type */}
                                            <div className="mb-3">
                                                <h3 className={`font-semibold text-base leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {dName}
                                                </h3>
                                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                                    {statusText}
                                                </p>
                                            </div>

                                            {/* AC/Thermostat Temperature Display */}
                                            {showTempControl && (
                                                <div className="flex items-baseline justify-between">
                                                    <span className={`text-2xl font-bold tabular-nums ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {temperature}°C
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                                                        {dType}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Light Brightness Bar */}
                                            {showBrightnessBar && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                                            {extraInfo}
                                                        </span>
                                                    </div>
                                                    <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                                                        <div
                                                            className="h-full bg-orange-500 rounded-full transition-all"
                                                            style={{ width: `${brightness}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* TV/Other Extra Info - Only show for non-AC/Thermostat devices */}
                                            {!showTempControl && !showBrightnessBar && extraInfo && (
                                                <div className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                                    {extraInfo}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Device Control Modal - Only for AC */}
            {showDeviceModal && selectedDevice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className={`absolute inset-0 transition-opacity ${isDarkMode ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/30 backdrop-blur-sm'}`}
                        onClick={() => setShowDeviceModal(false)}
                    />
                    <div
                        role="dialog"
                        className={`relative rounded-3xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg
                            ${isDarkMode
                                ? 'bg-slate-900 text-white'
                                : 'bg-white text-gray-900'}`}
                        style={{ boxShadow: isDarkMode ? '0 25px 70px rgba(0,0,0,0.7)' : '0 25px 60px rgba(0,0,0,0.15)' }}
                    >
                        <div className="p-6 md:p-8 overflow-y-auto max-h-[90vh]">

                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold">{getDeviceName(selectedDevice)}</h2>
                                    <div className={`flex items-center gap-1.5 mt-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                                        Đang hoạt động
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDeviceModal(false)}
                                    className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Temperature Circle */}
                            <div className="flex flex-col items-center mb-8">
                                <div className={`relative w-52 h-52 rounded-full flex items-center justify-center border-8 
                                    ${isDarkMode ? 'border-cyan-500/30' : 'border-orange-100'}`}>
                                    <div className="text-center">
                                        <div className="text-6xl font-bold">
                                            {deviceSettings.temperature}°<span className="text-4xl">C</span>
                                        </div>
                                        <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                            Phòng: 26°C
                                        </p>
                                    </div>
                                </div>

                                {/* +/- Buttons */}
                                <div className="flex items-center gap-8 mt-6">
                                    <button
                                        onClick={() => setDeviceSettings(prev => ({ ...prev, temperature: Math.max(16, prev.temperature - 1) }))}
                                        className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-3xl hover:bg-gray-200 dark:hover:bg-slate-700"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <span className="uppercase text-xs tracking-widest font-semibold text-gray-400">MỤC TIÊU</span>
                                    <button
                                        onClick={() => setDeviceSettings(prev => ({ ...prev, temperature: Math.min(30, prev.temperature + 1) }))}
                                        className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-3xl hover:bg-gray-200 dark:hover:bg-slate-700"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Chế độ */}
                            <div className="mb-8">
                                <p className="text-sm font-semibold mb-3">Chế độ</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {modes.map(mode => (
                                        <button
                                            key={mode}
                                            onClick={() => setDeviceSettings(prev => ({ ...prev, mode }))}
                                            className={`py-4 rounded-2xl font-medium flex flex-col items-center gap-1 text-sm transition-all
                                                ${deviceSettings.mode === mode
                                                    ? isDarkMode ? 'bg-cyan-500 text-slate-900' : 'bg-orange-500 text-white'
                                                    : isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                        >
                                            {mode === 'Làm mát' && <Wind size={24} />}
                                            {mode === 'Hút ẩm' && <Droplets size={24} />}
                                            {mode === 'Quạt' && <Wind size={24} className="rotate-45" />}
                                            <span>{mode}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tốc độ quạt */}
                            <div className="mb-8">
                                <div className="flex justify-between mb-2">
                                    <p className="text-sm font-semibold">Tốc độ quạt</p>
                                    <span className={`text-xs px-3 py-1 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-orange-100 text-orange-600'}`}>Trung bình</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={deviceSettings.brightness}
                                    onChange={(e) => setDeviceSettings(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                                    className="w-full accent-orange-500 dark:accent-cyan-400"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>Thấp</span>
                                    <span>Cao</span>
                                </div>
                            </div>

                            {/* Hẹn giờ */}
                            <div className={`p-4 rounded-2xl flex items-center justify-between mb-8 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                                        <Clock size={20} className="text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Hẹn giờ</p>
                                        <p className="text-sm text-gray-500">Tắt sau 2 giờ</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDeviceSettings(prev => ({ ...prev, hasSchedule: !prev.hasSchedule }))}
                                    className={`relative w-12 h-7 rounded-full ${deviceSettings.hasSchedule ? 'bg-orange-500' : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${deviceSettings.hasSchedule ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeviceModal(false)}
                                    className={`flex-1 py-4 rounded-2xl font-semibold border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'}`}
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSaveDeviceSettings}
                                    className="flex-1 py-4 rounded-2xl font-semibold bg-orange-500 hover:bg-orange-600 text-white"
                                >
                                    Lưu cài đặt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Device Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className={`absolute inset-0 transition-opacity ${isDarkMode ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/30 backdrop-blur-sm'}`}
                        onClick={() => setShowAddModal(false)}
                    />
                    <div className={`relative rounded-2xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-lg transform transition-all
                        ${isDarkMode ? 'max-h-[85vh] bg-slate-900 text-white' : 'max-h-[85vh] bg-white text-gray-900'}`}>
                        <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh]">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Thêm thiết bị mới</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className={`p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Device Name Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-2">Tên thiết bị</label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Đèn phòng khách"
                                    value={newDevice.name}
                                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                                    className={`w-full rounded-xl px-4 py-3 border outline-none transition-colors ${isDarkMode
                                        ? 'bg-slate-800 text-white placeholder-slate-500 border-slate-700 focus:border-orange-500'
                                        : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:border-orange-500'
                                        }`}
                                />
                            </div>

                            {/* Device Type Dropdown */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-2">Loại thiết bị</label>
                                <select
                                    value={newDevice.type}
                                    onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                                    className={`w-full rounded-xl px-4 py-3 border outline-none transition-colors ${isDarkMode
                                        ? 'bg-slate-800 text-white border-slate-700 focus:border-orange-500'
                                        : 'bg-white text-gray-900 border-gray-300 focus:border-orange-500'
                                        }`}
                                >
                                    {deviceTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Room Selection Dropdown */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold mb-2">Phòng</label>
                                <select
                                    value={selectedRoom ? getRoomId(selectedRoom) : ''}
                                    onChange={(e) => {
                                        const room = rooms.find(r => String(getRoomId(r)) === e.target.value);
                                        if (room) setSelectedRoom(room);
                                    }}
                                    className={`w-full rounded-xl px-4 py-3 border outline-none transition-colors ${isDarkMode
                                        ? 'bg-slate-800 text-white border-slate-700 focus:border-orange-500'
                                        : 'bg-white text-gray-900 border-gray-300 focus:border-orange-500'
                                        }`}
                                >
                                    <option value="">Chọn phòng</option>
                                    {rooms.map(room => (
                                        <option key={getRoomId(room)} value={getRoomId(room)}>
                                            {getRoomName(room)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className={`flex-1 px-4 py-3 rounded-xl font-semibold ${isDarkMode ? 'border border-slate-600 text-white hover:bg-slate-800' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleAddDevice}
                                    className="flex-1 px-4 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Room Modal */}
            {showAddRoomModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowAddRoomModal(false)}
                    />
                    <div className={`relative rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden
                        ${isDarkMode
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-gray-900'}`}>

                        {/* Header */}
                        <div className={`flex justify-between items-center px-6 py-5 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                            <h2 className="text-xl font-bold">Thêm phòng mới</h2>
                            <button
                                onClick={() => setShowAddRoomModal(false)}
                                className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

                            {/* Tên phòng */}
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tên phòng</label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Phòng giải trí"
                                    value={newRoomName}
                                    onChange={(e) => setNewRoomName(e.target.value)}
                                    className={`w-full rounded-xl px-4 py-3 border outline-none transition-colors text-sm ${isDarkMode
                                        ? 'bg-slate-800 text-white placeholder-slate-500 border-slate-700 focus:border-orange-500'
                                        : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200 focus:border-orange-500'}`}
                                />
                            </div>

                            {/* Biểu tượng phòng - Grid */}
                            <div>
                                <p className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Biểu tượng phòng</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {Object.keys(roomIconMap).map(iconKey => {
                                        const IconComponent = roomIconMap[iconKey];
                                        return (
                                            <button
                                                key={iconKey}
                                                onClick={() => setNewRoomIcon(iconKey)}
                                                className={`aspect-square flex items-center justify-center rounded-xl transition-all border-2 ${newRoomIcon === iconKey
                                                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                                                    : isDarkMode
                                                        ? 'bg-slate-800 border-transparent text-gray-400 hover:bg-slate-700'
                                                        : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'}`}
                                            >
                                                <IconComponent size={20} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                            <button
                                onClick={() => setShowAddRoomModal(false)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCreateRoom}
                                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms;