import React, { useState, useEffect, useContext } from 'react';
import { Plus, Clock, Thermometer, Home, Edit3, X, MapPin, Trash2 } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';
import { ThemeContext } from '../contexts/ThemeContext';
import axiosClient from '../api/axiosClient';

const Toggle = ({ checked, onChange }) => (
    <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 ${checked ? 'bg-orange-400' : 'bg-gray-200 dark:bg-gray-700'
            }`}
        aria-pressed={checked}
    >
        <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-1'
                }`}
        />
    </button>
);

const AutomationRow = ({ item, onToggle, onEdit, isDark, onDelete }) => (
    <div className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700 text-orange-300' : 'bg-orange-50 text-orange-500'}`}>
                {item.icon}
            </div>
            <div>
                <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name}</div>
                <div className={`text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>
                    Device: {item.sensorDeviceId} → {item.actionDeviceId}
                </div>
                {item.condition && <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>○ {item.condition} {item.thresholdValue}</div>}
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button
                onClick={() => onEdit(item)}
                className={`p-2 rounded-md ${isDark ? 'text-slate-300 hover:bg-white/6' : 'text-gray-500 hover:bg-gray-100'}`}
                title="Edit"
            >
                <Edit3 size={18} />
            </button>

            <Toggle checked={item.isActive} onChange={onToggle} />
        </div>
    </div>
);

const ScheduleRow = ({ item, onToggle, onEdit, isDark, onDelete }) => (
    <div className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700 text-blue-300' : 'bg-blue-50 text-blue-500'}`}>
                <Clock size={18} />
            </div>
            <div>
                <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Device ID: {item.smartDeviceId}
                </div>
                <div className={`text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>
                    {new Date(item.scheduledTime).toLocaleString('vi-VN')}
                </div>
                <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                    Action: {item.action}
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button
                onClick={() => onEdit(item)}
                className={`p-2 rounded-md ${isDark ? 'text-slate-300 hover:bg-white/6' : 'text-gray-500 hover:bg-gray-100'}`}
                title="Edit"
            >
                <Edit3 size={18} />
            </button>

            <Toggle checked={item.isActive} onChange={onToggle} />
        </div>
    </div>
);

const AddAutomationModal = ({ isOpen, onClose, isDark, onAdd, editingItem = null, devices = [] }) => {
    const [name, setName] = useState('');
    const [sensorDeviceId, setSensorDeviceId] = useState('');
    const [actionDeviceId, setActionDeviceId] = useState('');
    const [condition, setCondition] = useState('==');
    const [thresholdValue, setThresholdValue] = useState('');
    const [targetStatus, setTargetStatus] = useState('On');
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setName(editingItem.name);
            setSensorDeviceId(editingItem.sensorDeviceId);
            setActionDeviceId(editingItem.actionDeviceId);
            setCondition(editingItem.condition);
            setThresholdValue(editingItem.thresholdValue);
            setTargetStatus(editingItem.targetStatus);
            setIsActive(editingItem.isActive);
        } else {
            resetForm();
        }
    }, [editingItem, isOpen]);

    const resetForm = () => {
        setName('');
        setSensorDeviceId('');
        setActionDeviceId('');
        setCondition('==');
        setThresholdValue('');
        setTargetStatus('On');
        setIsActive(true);
    };

    const handleSave = async () => {
        if (!name.trim() || !sensorDeviceId || !actionDeviceId || !thresholdValue) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            const automationData = {
                name: name.trim(),
                sensorDeviceId: parseInt(sensorDeviceId),
                actionDeviceId: parseInt(actionDeviceId),
                condition: condition,
                thresholdValue: parseInt(thresholdValue),
                targetStatus: targetStatus,
                isActive: isActive
            };

            if (editingItem?.id) {
                await axiosClient.put(`/Automations/${editingItem.id}`, {
                    id: editingItem.id,
                    ...automationData
                });
                onAdd({ ...editingItem, ...automationData, updated: true });
            } else {
                const response = await axiosClient.post('/Automations', automationData);
                onAdd(response.data);
            }

            handleClose();
        } catch (error) {
            console.error('Error saving automation:', error);
            alert('Lỗi khi lưu tự động hóa: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`w-full max-w-2xl mx-4 rounded-lg shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {editingItem ? 'Cập nhật Tự động hóa' : 'Thêm Tự động hóa mới'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                        <X size={24} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                    </button>
                </div>

                {/* Body */}
                <div className={`p-6 space-y-6 max-h-96 overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    {/* Tên quy tắc */}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            TÊN QUY TẮC
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Vd: Bật đèn khi có người"
                            className={`w-full px-4 py-2 rounded-lg border ${isDark
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        />
                    </div>

                    {/* Sensor Device */}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
                            ⏱ ĐIỀU KIỆN (IF) - Chọn Sensor
                        </label>
                        <select
                            value={sensorDeviceId}
                            onChange={(e) => setSensorDeviceId(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        >
                            <option value="">-- Chọn thiết bị cảm biến --</option>
                            {devices.map(device => (
                                <option key={device.id} value={device.id}>
                                    {device.name} (ID: {device.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Condition */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Điều kiện
                            </label>
                            <select
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                className={`w-full px-4 py-2 rounded-lg border ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-gray-50 border-gray-300 text-gray-900'
                                    }`}
                            >
                                <option value="==">=</option>
                                <option value=">">&gt;</option>
                                <option value="<">&lt;</option>
                                <option value=">=">&gt;=</option>
                                <option value="<=">&lt;=</option>
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Giá trị ngưỡng
                            </label>
                            <input
                                type="number"
                                value={thresholdValue}
                                onChange={(e) => setThresholdValue(e.target.value)}
                                placeholder="Vd: 30"
                                className={`w-full px-4 py-2 rounded-lg border ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-gray-50 border-gray-300 text-gray-900'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Action Device */}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                            ▸ HÀNH ĐỘNG (THEN) - Chọn thiết bị
                        </label>
                        <select
                            value={actionDeviceId}
                            onChange={(e) => setActionDeviceId(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        >
                            <option value="">-- Chọn thiết bị hành động --</option>
                            {devices.map(device => (
                                <option key={device.id} value={device.id}>
                                    {device.name} (ID: {device.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Target Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Trạng thái target
                            </label>
                            <select
                                value={targetStatus}
                                onChange={(e) => setTargetStatus(e.target.value)}
                                className={`w-full px-4 py-2 rounded-lg border ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-gray-50 border-gray-300 text-gray-900'
                                    }`}
                            >
                                <option value="On">On</option>
                                <option value="Off">Off</option>
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Trạng thái
                            </label>
                            <button
                                onClick={() => setIsActive(!isActive)}
                                className={`w-full px-4 py-2 rounded-lg font-semibold ${isActive
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-400 text-white'
                                    }`}
                            >
                                {isActive ? 'Active' : 'Inactive'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`flex items-center justify-end gap-3 p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className={`px-6 py-2 rounded-lg font-semibold ${isDark
                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                            } disabled:opacity-50`}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 disabled:opacity-50"
                    >
                        {loading ? 'Đang lưu...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddScheduleModal = ({ isOpen, onClose, isDark, onAdd, editingItem = null, devices = [] }) => {
    const [smartDeviceId, setSmartDeviceId] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [action, setAction] = useState('On');
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setSmartDeviceId(editingItem.smartDeviceId);
            setScheduledTime(editingItem.scheduledTime?.slice(0, 16) || '');
            setAction(editingItem.action);
            setIsActive(editingItem.isActive);
        } else {
            resetForm();
        }
    }, [editingItem, isOpen]);

    const resetForm = () => {
        setSmartDeviceId('');
        setScheduledTime('');
        setAction('On');
        setIsActive(true);
    };

    const handleSave = async () => {
        if (!smartDeviceId || !scheduledTime) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            const scheduleData = {
                smartDeviceId: parseInt(smartDeviceId),
                scheduledTime: new Date(scheduledTime).toISOString(),
                action: action,
                isActive: isActive
            };

            if (editingItem?.id) {
                await axiosClient.put(`/Schedules/${editingItem.id}`, {
                    id: editingItem.id,
                    ...scheduleData
                });
                onAdd({ ...editingItem, ...scheduleData, updated: true });
            } else {
                const response = await axiosClient.post('/Schedules', scheduleData);
                onAdd(response.data);
            }

            handleClose();
        } catch (error) {
            console.error('Error saving schedule:', error);
            alert('Lỗi khi lưu lịch trình: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`w-full max-w-2xl mx-4 rounded-lg shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {editingItem ? 'Cập nhật Lịch trình' : 'Thêm Lịch trình mới'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                        <X size={24} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                    </button>
                </div>

                <div className={`p-6 space-y-6 max-h-96 overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            CHỌN THIẾT BỊ
                        </label>
                        <select
                            value={smartDeviceId}
                            onChange={(e) => setSmartDeviceId(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option value="">-- Chọn thiết bị --</option>
                            {devices.map(device => (
                                <option key={device.id} value={device.id}>
                                    {device.name} (ID: {device.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            THỜI GIAN THỰC HIỆN
                        </label>
                        <input
                            type="datetime-local"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                HÀNH ĐỘNG
                            </label>
                            <select
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                className={`w-full px-4 py-2 rounded-lg border ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-gray-50 border-gray-300 text-gray-900'
                                    }`}
                            >
                                <option value="On">On</option>
                                <option value="Off">Off</option>
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                TRẠNG THÁI
                            </label>
                            <button
                                onClick={() => setIsActive(!isActive)}
                                className={`w-full px-4 py-2 rounded-lg font-semibold ${isActive
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-400 text-white'
                                    }`}
                            >
                                {isActive ? 'Active' : 'Inactive'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`flex items-center justify-end gap-3 p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className={`px-6 py-2 rounded-lg font-semibold ${isDark
                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                            } disabled:opacity-50`}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 disabled:opacity-50"
                    >
                        {loading ? 'Đang lưu...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const iconForId = (iconId) => {
    switch (iconId) {
        case 'thermometer': return <Thermometer size={18} />;
        case 'clock': return <Clock size={18} />;
        case 'home': return <Home size={18} />;
        default: return <Clock size={18} />;
    }
};

const Automations = () => {
    const { t } = useContext(LanguageContext);
    const { isDarkMode } = useContext(ThemeContext);

    const [activeTab, setActiveTab] = useState('automations');
    const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [editingAutomation, setEditingAutomation] = useState(null);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [automations, setAutomations] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [automationsRes, schedulesRes, devicesRes] = await Promise.all([
                axiosClient.get('/Automations'),
                axiosClient.get('/Schedules'),
                axiosClient.get('/Devices')
            ]);
            
            const automationsWithIcons = automationsRes.data.map(item => ({
                ...item,
                icon: iconForId(item.iconId || 'clock')
            }));
            
            setAutomations(automationsWithIcons);
            setSchedules(schedulesRes.data);
            setDevices(devicesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAutomation = async (id) => {
        const item = automations.find(i => i.id === id);
        if (!item) return;

        try {
            const updatedData = {
                id: item.id,
                name: item.name,
                sensorDeviceId: item.sensorDeviceId,
                condition: item.condition,
                thresholdValue: item.thresholdValue,
                actionDeviceId: item.actionDeviceId,
                targetStatus: item.targetStatus,
                isActive: !item.isActive
            };
            
            await axiosClient.put(`/Automations/${id}`, updatedData);
            setAutomations(prev => prev.map(it => it.id === id ? { ...it, isActive: !it.isActive } : it));
        } catch (error) {
            console.error('Error toggling automation:', error);
            alert('Lỗi khi cập nhật trạng thái');
        }
    };

    const handleToggleSchedule = async (id) => {
        const item = schedules.find(i => i.id === id);
        if (!item) return;

        try {
            const updatedData = {
                id: item.id,
                smartDeviceId: item.smartDeviceId,
                scheduledTime: item.scheduledTime,
                action: item.action,
                isActive: !item.isActive
            };
            
            await axiosClient.put(`/Schedules/${id}`, updatedData);
            setSchedules(prev => prev.map(it => it.id === id ? { ...it, isActive: !it.isActive } : it));
        } catch (error) {
            console.error('Error toggling schedule:', error);
            alert('Lỗi khi cập nhật trạng thái');
        }
    };

    const handleEditAutomation = (item) => {
        setEditingAutomation(item);
        setIsAutomationModalOpen(true);
    };

    const handleEditSchedule = (item) => {
        setEditingSchedule(item);
        setIsScheduleModalOpen(true);
    };

    const handleAddAutomation = (newAutomation) => {
        if (newAutomation.updated) {
            setAutomations(prev => prev.map(item => item.id === newAutomation.id ? newAutomation : item));
        } else {
            const automationWithIcon = {
                ...newAutomation,
                icon: iconForId(newAutomation.iconId || 'clock')
            };
            setAutomations(prev => [automationWithIcon, ...prev]);
        }
        setEditingAutomation(null);
    };

    const handleAddSchedule = (newSchedule) => {
        if (newSchedule.updated) {
            setSchedules(prev => prev.map(item => item.id === newSchedule.id ? newSchedule : item));
        } else {
            setSchedules(prev => [newSchedule, ...prev]);
        }
        setEditingSchedule(null);
    };

    const handleDeleteAutomation = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa quy tắc này?')) {
            try {
                await axiosClient.delete(`/Automations/${id}`);
                setAutomations(prev => prev.filter(item => item.id !== id));
            } catch (error) {
                console.error('Error deleting automation:', error);
                alert('Lỗi khi xóa: ' + error.message);
            }
        }
    };

    const handleDeleteSchedule = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lịch trình này?')) {
            try {
                await axiosClient.delete(`/Schedules/${id}`);
                setSchedules(prev => prev.filter(item => item.id !== id));
            } catch (error) {
                console.error('Error deleting schedule:', error);
                alert('Lỗi khi xóa: ' + error.message);
            }
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-8">
                <div className="flex items-center justify-between mb-10">
                    <h1 className={`text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t ? t('menu.automations', 'Tự động hóa') : 'Tự động hóa'}
                    </h1>

                    <div>
                        {activeTab === 'automations' ? (
                            <button 
                                onClick={() => setIsAutomationModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-400 shadow"
                            >
                                <Plus size={16} /> Thêm Tự Động Hóa
                            </button>
                        ) : (
                            <button 
                                onClick={() => setIsScheduleModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-400 shadow"
                            >
                                <Plus size={16} /> Thêm Lịch Trình
                            </button>
                        )}
                    </div>
                </div>

                <nav className="flex -mb-px space-x-6 mb-6">
                    <button onClick={() => setActiveTab('automations')} className={`py-3 px-1 border-b-2 font-medium ${activeTab === 'automations' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'}`}>
                        {t ? t('automations.tab.automations', 'Tự động hóa') : 'Tự động hóa'}
                    </button>
                    <button onClick={() => setActiveTab('schedules')} className={`py-3 px-1 border-b-2 font-medium ${activeTab === 'schedules' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>
                        {t ? t('automations.tab.schedules', 'Lịch trình') : 'Lịch trình'}
                    </button>
                </nav>

                {activeTab === 'automations' ? (
                    <section>
                        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tự động hóa của tôi</h2>
                        <div className="space-y-4">
                            {automations.length > 0 ? (
                                automations.map(item => (
                                    <AutomationRow 
                                        key={item.id} 
                                        item={item} 
                                        onToggle={() => handleToggleAutomation(item.id)} 
                                        onEdit={handleEditAutomation} 
                                        isDark={isDarkMode}
                                        onDelete={handleDeleteAutomation}
                                    />
                                ))
                            ) : (
                                <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>Chưa có quy tắc tự động hóa nào</p>
                            )}
                        </div>
                    </section>
                ) : (
                    <section>
                        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Lịch trình của tôi</h2>
                        <div className="space-y-4">
                            {schedules.length > 0 ? (
                                schedules.map(item => (
                                    <ScheduleRow 
                                        key={item.id} 
                                        item={item} 
                                        onToggle={() => handleToggleSchedule(item.id)} 
                                        onEdit={handleEditSchedule} 
                                        isDark={isDarkMode}
                                        onDelete={handleDeleteSchedule}
                                    />
                                ))
                            ) : (
                                <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>Chưa có lịch trình nào</p>
                            )}
                        </div>
                    </section>
                )}
            </div>

            <AddAutomationModal 
                isOpen={isAutomationModalOpen}
                onClose={() => setIsAutomationModalOpen(false)}
                isDark={isDarkMode}
                onAdd={handleAddAutomation}
                editingItem={editingAutomation}
                devices={devices}
            />

            <AddScheduleModal 
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                isDark={isDarkMode}
                onAdd={handleAddSchedule}
                editingItem={editingSchedule}
                devices={devices}
            />
        </div>
    );
};

export default Automations;