import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, Edit2, Thermometer, Clock, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Automations = () => {
    const navigate = useNavigate();
    const [automations, setAutomations] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [activeTab, setActiveTab] = useState('automations'); // 'automations' or 'schedules'
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    const getAuthHeaders = useCallback(() => {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    }, [token]);

    // Fetch dữ liệu
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [autoRes, schedRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/Automations`, { 
                        method: 'GET', 
                        headers: getAuthHeaders() 
                    }),
                    fetch(`${API_BASE_URL}/Schedules`, { 
                        method: 'GET', 
                        headers: getAuthHeaders() 
                    })
                ]);

                if (autoRes.ok) {
                    setAutomations(await autoRes.json() || []);
                }
                if (schedRes.ok) {
                    setSchedules(await schedRes.json() || []);
                }
            } catch (e) {
                console.error('Lỗi fetch dữ liệu:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [getAuthHeaders]);

    // Toggle automation
    const handleToggleAutomation = async (automation) => {
        const autoId = automation.id || automation.Id;
        const currentActive = automation.isActive !== undefined ? automation.isActive : automation.IsActive;
        const updatedAuto = { ...automation, isActive: !currentActive, IsActive: !currentActive };

        setAutomations(prev => prev.map(a => (a.id || a.Id) === autoId ? updatedAuto : a));

        try {
            await fetch(`${API_BASE_URL}/Automations/${autoId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updatedAuto)
            });
        } catch (error) {
            console.error('Lỗi cập nhật tự động hóa:', error);
            // Revert on error
            setAutomations(prev => prev.map(a => (a.id || a.Id) === autoId ? automation : a));
        }
    };

    // Toggle schedule
    const handleToggleSchedule = async (schedule) => {
        const schedId = schedule.id || schedule.Id;
        const currentActive = schedule.isActive !== undefined ? schedule.isActive : schedule.IsActive;
        const updatedSched = { ...schedule, isActive: !currentActive, IsActive: !currentActive };

        setSchedules(prev => prev.map(s => (s.id || s.Id) === schedId ? updatedSched : s));

        try {
            await fetch(`${API_BASE_URL}/Schedules/${schedId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updatedSched)
            });
        } catch (error) {
            console.error('Lỗi cập nhật lịch trình:', error);
            // Revert on error
            setSchedules(prev => prev.map(s => (s.id || s.Id) === schedId ? schedule : s));
        }
    };

    // Get icon based on automation type
    const getAutomationIcon = (condition) => {
        const lowerCondition = condition?.toLowerCase() || '';
        
        if (lowerCondition.includes('temperature') || lowerCondition.includes('nhiệt độ') || lowerCondition.includes('30')) {
            return <Thermometer size={24} className="text-orange-500" />;
        }
        if (lowerCondition.includes('time') || lowerCondition.includes('11:00') || lowerCondition.includes('lúc')) {
            return <Clock size={24} className="text-orange-500" />;
        }
        if (lowerCondition.includes('light') || lowerCondition.includes('đèn')) {
            return <Lightbulb size={24} className="text-orange-500" />;
        }
        
        return <Thermometer size={24} className="text-orange-500" />;
    };

    // Get automation name, condition, and room
    const getAutoName = (auto) => auto.name || auto.Name || 'Tự động hóa';
    const getAutoCondition = (auto) => auto.condition || auto.Condition || 'Điều kiện';
    const getAutoRoom = (auto) => auto.roomName || auto.RoomName || auto.room || auto.Room || 'Phòng chưa rõ';
    const getAutoId = (auto) => auto.id || auto.Id;
    const getAutoActive = (auto) => auto.isActive !== undefined ? auto.isActive : auto.IsActive;

    // Get schedule info
    const getScheduleId = (sched) => sched.id || sched.Id;
    const getScheduleDeviceName = (sched) => sched.deviceName || sched.DeviceName || 'Thiết bị';
    const getScheduleRoom = (sched) => sched.roomName || sched.RoomName || 'Phòng';
    const getScheduleTime = (sched) => sched.scheduledTime || sched.ScheduledTime || '00:00';
    const getScheduleActive = (sched) => sched.isActive !== undefined ? sched.isActive : sched.IsActive;

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="p-10">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <h1 className="text-3xl font-black text-gray-900">Tự động hóa & Lịch trình</h1>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors">
                    <Plus size={20} /> Thêm Tự Động Hóa
                </button>
            </header>

            {/* Tabs */}
            <div className="mb-8 border-b border-gray-200">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('automations')}
                        className={`pb-4 text-lg font-semibold transition-colors relative ${
                            activeTab === 'automations'
                                ? 'text-orange-500'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Tự động hóa
                        {activeTab === 'automations' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('schedules')}
                        className={`pb-4 text-lg font-semibold transition-colors relative ${
                            activeTab === 'schedules'
                                ? 'text-orange-500'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Lịch trình
                        {activeTab === 'schedules' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div>
                {activeTab === 'automations' ? (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tự động hóa của tôi</h2>

                        {automations.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <p className="text-lg">Chưa có tự động hóa nào được thiết lập</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {automations.map(auto => {
                                    const autoId = getAutoId(auto);
                                    const autoName = getAutoName(auto);
                                    const autoCondition = getAutoCondition(auto);
                                    const autoRoom = getAutoRoom(auto);
                                    const isActive = getAutoActive(auto);

                                    return (
                                        <div
                                            key={autoId}
                                            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4 flex-1">
                                                    {/* Icon */}
                                                    <div className="mt-2">
                                                        {getAutomationIcon(autoCondition)}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-gray-900">{autoName}</h3>
                                                        <p className="text-sm text-gray-600 mt-1">{autoRoom}</p>
                                                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                                            <Clock size={14} />
                                                            {autoCondition}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Controls */}
                                                <div className="flex items-center gap-3 ml-4">
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <Edit2 size={18} className="text-gray-400 hover:text-gray-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleAutomation(auto)}
                                                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                                                            isActive ? 'bg-orange-500' : 'bg-gray-300'
                                                        }`}
                                                    >
                                                        <div
                                                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                                                                isActive ? 'translate-x-6' : 'translate-x-0'
                                                            }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch trình của tôi</h2>

                        {schedules.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <p className="text-lg">Chưa có lịch trình nào được thiết lập</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {schedules.map(sched => {
                                    const schedId = getScheduleId(sched);
                                    const deviceName = getScheduleDeviceName(sched);
                                    const room = getScheduleRoom(sched);
                                    const time = getScheduleTime(sched);
                                    const isActive = getScheduleActive(sched);
                                    
                                    // Format time
                                    const formattedTime = time.includes(':')
                                        ? time
                                        : new Date(time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

                                    return (
                                        <div
                                            key={schedId}
                                            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4 flex-1">
                                                    {/* Icon */}
                                                    <div className="mt-2">
                                                        <Clock size={24} className="text-orange-500" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-gray-900">{deviceName}</h3>
                                                        <p className="text-sm text-gray-600 mt-1">{room}</p>
                                                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                                            <Clock size={14} />
                                                            Lúc {formattedTime} mỗi ngày
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Controls */}
                                                <div className="flex items-center gap-3 ml-4">
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <Edit2 size={18} className="text-gray-400 hover:text-gray-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleSchedule(sched)}
                                                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                                                            isActive ? 'bg-orange-500' : 'bg-gray-300'
                                                        }`}
                                                    >
                                                        <div
                                                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                                                                isActive ? 'translate-x-6' : 'translate-x-0'
                                                            }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Automations;