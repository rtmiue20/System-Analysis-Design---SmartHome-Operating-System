import React, { useState, useEffect, useRef } from 'react';
import { Clock, Plus, Thermometer, Lightbulb, X, ChevronDown, CheckCircle, AlertCircle, Minus, RotateCcw, Volume2 } from 'lucide-react';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [devices, setDevices] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
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

    const deviceTypes = ['Light', 'AC', 'TV', 'Thermostat', 'Curtain', 'Speaker', 'Camera', 'Lock'];
    const modes = ['Làm mát', 'Hút ẩm', 'Quạt'];

    // Add toast notification
    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
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
                            const foundRoom = roomsData.find(r => {
                                const rId = getRoomId(r);
                                return String(rId) === String(selectedRoomId);
                            });
                            
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
            if (dId === deviceId) {
                return { ...d, status: newStatus, Status: newStatus };
            }
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
                setDevices(prev => prev.map(d => {
                    const dId = getDeviceId(d);
                    return dId === deviceId ? updatePayload : d;
                }));
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

    const getDeviceIcon = (type, isOn) => {
        const color = isOn ? 'text-orange-500' : 'text-gray-400';
        const lowerType = type?.toLowerCase() || '';

        if (lowerType.includes('light') || lowerType.includes('đèn')) {
            return <Lightbulb size={32} className={color} />;
        }
        return <Thermometer size={32} className={color} />;
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
        <div className="p-10">
            {/* Toast Notifications */}
            <div className="fixed top-6 right-6 z-50 space-y-3">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 ${
                            toast.type === 'success'
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
                    <h2 className="text-4xl font-black text-gray-900">
                        {selectedRoom ? getRoomName(selectedRoom) : 'Chọn phòng'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {filteredDevices.length} thiết bị
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
                    >
                        <Plus size={20} /> Thêm thiết bị
                    </button>
                    <div className="bg-orange-100 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold text-orange-600">
                        <Clock size={18} />
                        {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </header>

            {/* Room list in sidebar (shown left in layout) + devices on right */}
            <div className="flex gap-6">
                {/* Left: Room list */}
                <div className="w-56 flex-shrink-0">
                    <h3 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">CÁC PHÒNG</h3>
                    <div className="space-y-2">
                        {rooms.map(room => {
                            const rId = getRoomId(room);
                            const rName = getRoomName(room);
                            const isSelected = selectedRoom && String(getRoomId(selectedRoom)) === String(rId);

                            return (
                                <button
                                    key={rId}
                                    onClick={() => setSelectedRoom(room)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                        isSelected
                                            ? 'bg-orange-100 text-orange-600 border-2 border-orange-500'
                                            : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                                    }`}
                                >
                                    {rName}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Device cards */}
                <div className="flex-1">
                    {filteredDevices.length === 0 ? (
                        <div className="flex items-center justify-center h-96 text-gray-400">
                            <p className="text-lg">Phòng này chưa có thiết bị nào</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                            {filteredDevices.map(device => {
                                const dId = getDeviceId(device);
                                const dName = getDeviceName(device);
                                const dType = device.type || device.Type;
                                const dStatus = device.status || device.Status;
                                const isOn = dStatus === 'On' || dStatus === 'on';

                                return (
                                    <div
                                        key={dId}
                                        onClick={() => handleOpenDeviceModal(device)}
                                        className="bg-white rounded-3xl border-2 border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                {getDeviceIcon(dType, isOn)}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleDevice(dId, dStatus);
                                                }}
                                                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                                                    isOn ? 'bg-orange-500' : 'bg-gray-300'
                                                }`}
                                            >
                                                <div
                                                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                                                        isOn ? 'translate-x-6' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{dName}</h3>
                                            <p className="text-sm text-gray-500 mt-2">{dType}</p>

                                            {device.temperature && (
                                                <div className="mt-4 flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-orange-500">
                                                        {device.temperature}°C
                                                    </span>
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

            {/* Device Control Modal */}
            {showDeviceModal && selectedDevice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
                    <div className="bg-gradient-to-br from-teal-900 to-teal-800 rounded-3xl p-8 w-full max-w-md text-white">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{getDeviceName(selectedDevice)}</h2>
                                <p className="text-sm text-teal-200 mt-1">● Đang hoạt động</p>
                            </div>
                            <button
                                onClick={() => setShowDeviceModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Temperature Display & Control */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-48 h-48 rounded-full border-4 border-cyan-400 flex items-center justify-center mb-4">
                                <div className="text-center">
                                    <div className="text-5xl font-bold">{deviceSettings.temperature}°<span className="text-3xl">C</span></div>
                                    <p className="text-teal-200 text-sm mt-2">Phòng: 26°C</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-6">
                                <button
                                    onClick={() => setDeviceSettings(prev => ({ ...prev, temperature: Math.max(16, prev.temperature - 1) }))
}
                                    className="w-12 h-12 rounded-full bg-teal-700 hover:bg-teal-600 flex items-center justify-center transition-colors"
                                >
                                    <Minus size={24} />
                                </button>
                                <span className="text-teal-200">MỤC TIÊU</span>
                                <button
                                    onClick={() => setDeviceSettings(prev => ({ ...prev, temperature: Math.min(30, prev.temperature + 1) }))
}
                                    className="w-12 h-12 rounded-full bg-teal-700 hover:bg-teal-600 flex items-center justify-center transition-colors"
                                >
                                    <Plus size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Mode Selection */}
                        <div className="mb-8">
                            <p className="text-sm font-semibold mb-3">Chế độ</p>
                            <div className="flex gap-3">
                                {modes.map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => setDeviceSettings(prev => ({ ...prev, mode }))
}
                                        className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                                            deviceSettings.mode === mode
                                                ? 'bg-cyan-400 text-teal-900'
                                                : 'bg-teal-700 hover:bg-teal-600 text-white'
                                        }`}
                                    >
                                        {mode === 'Làm mát' && '❄️'} 
                                        {mode === 'Hút ẩm' && '💧'} 
                                        {mode === 'Quạt' && '🌀'} 
                                        {' '}{mode}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Brightness Slider */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-semibold">Tốc độ quạt</p>
                                <span className="text-cyan-400 text-sm font-semibold">Trung bình</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={deviceSettings.brightness}
                                onChange={(e) => setDeviceSettings(prev => ({ ...prev, brightness: parseInt(e.target.value) }))
}
                                className="w-full h-2 bg-teal-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                            />
                            <div className="flex justify-between text-xs text-teal-200 mt-1">
                                <span>Thấp</span>
                                <span>Cao</span>
                            </div>
                        </div>

                        {/* Schedule Option */}
                        <div className="bg-teal-700/50 rounded-xl p-4 mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Clock size={20} />
                                <div>
                                    <p className="font-semibold">Hẹn giờ</p>
                                    <p className="text-xs text-teal-200">Tắt lúc 2 giờ</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDeviceSettings(prev => ({ ...prev, hasSchedule: !prev.hasSchedule }))
}
                                className={`relative w-12 h-7 rounded-full transition-colors ${
                                    deviceSettings.hasSchedule ? 'bg-cyan-400' : 'bg-teal-600'
                                }`}
                            >
                                <div
                                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                                        deviceSettings.hasSchedule ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeviceModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl border border-cyan-400 text-white font-semibold hover:bg-white/10 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveDeviceSettings}
                                className="flex-1 px-4 py-3 rounded-xl bg-cyan-400 text-teal-900 font-semibold hover:bg-cyan-300 transition-colors"
                            >
                                Lưu cài đặt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Device Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
                    <div className="bg-gray-900 rounded-3xl p-8 w-full max-w-md text-white">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Thêm thiết bị mới</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Device Name Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-2">Tên thiết bị</label>
                            <input
                                type="text"
                                placeholder="Vị dụ: Đèn phòng khách"
                                value={newDevice.name}
                                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                                className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl px-4 py-3 border border-gray-700 focus:border-orange-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Device Type Dropdown */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-2">Loại thiết bị</label>
                            <div className="relative">
                                <select
                                    value={newDevice.type}
                                    onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-orange-500 focus:outline-none appearance-none transition-colors cursor-pointer"
                                >
                                    {deviceTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
                            </div>
                        </div>

                        {/* Room Selection Dropdown */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold mb-2">Phòng</label>
                            <div className="relative">
                                <select
                                    value={selectedRoom ? getRoomId(selectedRoom) : ''}
                                    onChange={(e) => {
                                        const room = rooms.find(r => String(getRoomId(r)) === e.target.value);
                                        if (room) setSelectedRoom(room);
                                    }}
                                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-orange-500 focus:outline-none appearance-none transition-colors cursor-pointer"
                                >
                                    <option value="">Chọn phòng</option>
                                    {rooms.map(room => (
                                        <option key={getRoomId(room)} value={getRoomId(room)}>
                                            {getRoomName(room)}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-700 text-white font-semibold hover:bg-gray-800 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleAddDevice}
                                className="flex-1 px-4 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-colors"
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