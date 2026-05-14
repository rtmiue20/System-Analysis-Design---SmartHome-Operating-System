import React, { useState, useEffect, useContext } from 'react';
import { Plus, Clock, Thermometer, Home, Edit3, X, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';
import { ThemeContext } from '../contexts/ThemeContext';
import axiosClient from '../api/axiosClient';

// ==================== TOAST NOTIFICATION COMPONENT ====================
const Toast = ({ message, type = 'info', isDark }) => {
    return (
        <div
            className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-50 transition-all ${type === 'error'
                ? isDark
                    ? 'bg-red-900 text-red-100'
                    : 'bg-red-50 text-red-800 border border-red-200'
                : type === 'success'
                    ? isDark
                        ? 'bg-green-900 text-green-100'
                        : 'bg-green-50 text-green-800 border border-green-200'
                    : isDark
                        ? 'bg-blue-900 text-blue-100'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}
        >
            {type === 'error' ? (
                <AlertCircle size={20} />
            ) : (
                <CheckCircle size={20} />
            )}
            <span>{message}</span>
        </div>
    );
};

// ==================== TOGGLE COMPONENT ====================
const Toggle = ({ checked, onChange, disabled = false }) => (
    <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 ${checked ? 'bg-orange-400' : 'bg-gray-200 dark:bg-gray-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-pressed={checked}
    >
        <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-1'
                }`}
        />
    </button>
);

// ==================== AUTOMATION ROW COMPONENT ====================
const AutomationRow = ({ item, onToggle, onEdit, isDark, onDelete, loading }) => (
    <div
        className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-opacity ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
            } ${loading ? 'opacity-50' : ''}`}
    >
        <div className="flex items-center gap-4 flex-1">
            <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700 text-orange-300' : 'bg-orange-50 text-orange-500'
                    }`}
            >
                {item.icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.ruleName}
                </div>
                <div className={`text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>
                    Device: {item.sensorDeviceId} → {item.actionDeviceId}
                </div>
                {item.conditionOperator && (
                    <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                        ○ {item.conditionOperator} {item.conditionValue}
                    </div>
                )}
            </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
            <button
                onClick={() => onEdit(item)}
                disabled={loading}
                className={`p-2 rounded-md transition-colors ${isDark ? 'text-slate-300 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Edit"
            >
                <Edit3 size={18} />
            </button>
            <button
                onClick={() => onDelete(item.id)}
                disabled={loading}
                className={`p-2 rounded-md transition-colors ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Delete"
            >
                <Trash2 size={18} />
            </button>
            <Toggle checked={item.isActive} onChange={onToggle} disabled={loading} />
        </div>
    </div>
);

// ==================== SCHEDULE ROW COMPONENT ====================
const ScheduleRow = ({ item, onToggle, onEdit, isDark, onDelete, loading }) => (
    <div
        className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-opacity ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
            } ${loading ? 'opacity-50' : ''}`}
    >
        <div className="flex items-center gap-4 flex-1">
            <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700 text-blue-300' : 'bg-blue-50 text-blue-500'
                    }`}
            >
                <Clock size={18} />
            </div>
            <div className="flex-1 min-w-0">
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

        <div className="flex items-center gap-3 flex-shrink-0">
            <button
                onClick={() => onEdit(item)}
                disabled={loading}
                className={`p-2 rounded-md transition-colors ${isDark ? 'text-slate-300 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Edit"
            >
                <Edit3 size={18} />
            </button>
            <button
                onClick={() => onDelete(item.id)}
                disabled={loading}
                className={`p-2 rounded-md transition-colors ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Delete"
            >
                <Trash2 size={18} />
            </button>
            <Toggle checked={item.isActive} onChange={onToggle} disabled={loading} />
        </div>
    </div>
);

const AddAutomationModal = ({ isOpen, onClose, isDark, onAdd, editingItem = null, devices = [] }) => {
    const [ruleName, setRuleName] = useState('');
    const [sensorDeviceId, setSensorDeviceId] = useState('');
    const [actionDeviceId, setActionDeviceId] = useState('');
    const [conditionOperator, setConditionOperator] = useState('>');
    const [conditionValue, setConditionValue] = useState('');
    const [targetStatus, setTargetStatus] = useState('On');
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingItem) {
            setRuleName(editingItem.ruleName || '');
            setSensorDeviceId(String(editingItem.sensorDeviceId || ''));
            setActionDeviceId(String(editingItem.actionDeviceId || ''));
            setConditionOperator(editingItem.conditionOperator || '>');
            setConditionValue(String(editingItem.conditionValue || ''));
            setTargetStatus(editingItem.targetStatus || 'On');
            setIsActive(editingItem.isActive !== undefined ? editingItem.isActive : true);
        } else {
            resetForm();
        }
    }, [editingItem]);

    const resetForm = () => {
        setRuleName('');
        setSensorDeviceId('');
        setActionDeviceId('');
        setConditionOperator('>');
        setConditionValue('');
        setTargetStatus('On');
        setIsActive(true);
        setErrors({});
    };

    // Filter Devices
    const sensorDevices = devices.filter(d => {
        const deviceType = String(d.type || d.Type || d.deviceType || '').toLowerCase().trim();
        return deviceType === 'sensor' || deviceType.includes('sensor');
    }).sort((a, b) => a.name?.localeCompare(b.name));

    const actionDevices = devices.filter(d => {
        const deviceType = String(d.type || d.Type || d.deviceType || '').toLowerCase().trim();
        return deviceType !== 'sensor' && !deviceType.includes('sensor');
    }).sort((a, b) => a.name?.localeCompare(b.name));

    const validateForm = () => {
        const newErrors = {};
        if (!ruleName.trim()) newErrors.ruleName = 'Tên quy tắc là bắt buộc';
        if (!sensorDeviceId) newErrors.sensorDeviceId = 'Vui lòng chọn Sensor';
        if (!actionDeviceId) newErrors.actionDeviceId = 'Vui lòng chọn thiết bị thực hiện';
        if (sensorDeviceId === actionDeviceId) newErrors.actionDeviceId = 'Sensor và Action không được trùng';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        const sensorId = parseInt(sensorDeviceId);
        const actionId = parseInt(actionDeviceId);

        if (!sensorId || !actionId) {
            setErrors({ submit: 'Vui lòng chọn đầy đủ Sensor và Thiết bị thực hiện' });
            return;
        }

        setLoading(true);
        try {
            const automationData = {
                ruleName: ruleName.trim(),
                sensorDeviceId: sensorId,
                actionDeviceId: actionId,
                conditionOperator: conditionOperator === '=' ? '==' : conditionOperator,
                conditionValue: parseFloat(conditionValue) || 0,
                targetStatus,
                isActive
            };

            console.log("📤 Gửi dữ liệu:", automationData);

            let response;
            if (editingItem?.id) {
                // For update, include the Id
                response = await axiosClient.put(`/Automations/${editingItem.id}`, {
                    id: editingItem.id,
                    ...automationData
                });
                // PUT returns NoContent (204), so construct response data
                onAdd({ id: editingItem.id, ...automationData, updated: true });
            } else {
                // For create, send only the data without sensorDevice and actionDevice
                response = await axiosClient.post('/Automations', automationData);
                onAdd(response.data || automationData);
            }
            handleClose();
        } catch (error) {
            console.error("❌ Lỗi:", error.response?.data || error);
            setErrors({
                submit: error.response?.data?.message || 'Lỗi server, xem console để biết chi tiết'
            });
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-2xl rounded-2xl shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <h2 className="text-xl font-semibold">Thêm Tự động hóa mới</h2>
                    <button onClick={handleClose}><X size={24} /></button>
                </div>

                <div className="p-6 space-y-6">
                    {errors.submit && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl">
                            {errors.submit}
                        </div>
                    )}

                    {/* Tên quy tắc */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">TÊN QUY TẮC</label>
                        <input
                            type="text"
                            value={ruleName}
                            onChange={(e) => setRuleName(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-300'}`}
                            placeholder="Vd: Bật máy hút mùi khi có khói"
                        />
                    </div>

                    {/* Sensor */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-teal-600">ĐIỀU KIỆN (IF) - Chọn Sensor</label>
                        <select
                            value={sensorDeviceId}
                            onChange={(e) => setSensorDeviceId(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                        >
                            <option value="">-- Chọn thiết bị cảm biến --</option>
                            {sensorDevices.map(device => (
                                <option key={device.id} value={device.id}>
                                    {device.name} (ID: {device.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Condition */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Toán tử</label>
                            <select value={conditionOperator} onChange={e => setConditionOperator(e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300'}`}>
                                <option value=">">&gt;</option>
                                <option value="<">&lt;</option>
                                <option value=">=">&gt;=</option>
                                <option value="<=">&lt;=</option>
                                <option value="==">=</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Giá trị</label>
                            <input type="number" value={conditionValue} onChange={e => setConditionValue(e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300'}`} placeholder="30" />
                        </div>
                    </div>

                    {/* Action Device */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-orange-600">HÀNH ĐỘNG (THEN) - Chọn thiết bị thực hiện</label>
                        <select
                            value={actionDeviceId}
                            onChange={(e) => setActionDeviceId(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                        >
                            <option value="">-- Chọn thiết bị hành động --</option>
                            {actionDevices.map(device => (
                                <option key={device.id} value={device.id}>
                                    {device.name} (ID: {device.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Target Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Trạng thái target</label>
                            <select value={targetStatus} onChange={e => setTargetStatus(e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300'}`}>
                                <option value="On">Bật (On)</option>
                                <option value="Off">Tắt (Off)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Trạng thái quy tắc</label>
                            <button onClick={() => setIsActive(!isActive)} className={`w-full py-3 rounded-xl font-semibold ${isActive ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}`}>
                                {isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t">
                    <button onClick={handleClose} className={`px-6 py-3 rounded-xl border ${isDark ? 'border-slate-600 text-white hover:bg-slate-700' : 'border-gray-300 text-gray-900 hover:bg-gray-50'}`}>Hủy</button>
                    <button onClick={handleSave} disabled={loading} className="px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 disabled:opacity-50">
                        {loading ? 'Đang lưu...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==================== ADD SCHEDULE MODAL ====================
const AddScheduleModal = ({ isOpen, onClose, isDark, onAdd, editingItem = null, devices = [] }) => {
    const [smartDeviceId, setSmartDeviceId] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [action, setAction] = useState('On');
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingItem) {
            setSmartDeviceId(editingItem.smartDeviceId || '');
            setScheduledTime(editingItem.scheduledTime?.slice(0, 16) || '');
            setAction(editingItem.action || 'On');
            setIsActive(editingItem.isActive !== undefined ? editingItem.isActive : true);
            setErrors({});
        } else {
            resetForm();
        }
    }, [editingItem, isOpen]);

    const resetForm = () => {
        setSmartDeviceId('');
        setScheduledTime('');
        setAction('On');
        setIsActive(true);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!smartDeviceId) {
            newErrors.smartDeviceId = 'Vui lòng chọn thiết bị';
        }

        if (!scheduledTime) {
            newErrors.scheduledTime = 'Vui lòng chọn thời gian';
        } else {
            const selectedTime = new Date(scheduledTime);
            const now = new Date();
            if (selectedTime < now && !editingItem) {
                newErrors.scheduledTime = 'Thời gian phải lớn hơn thời gian hiện tại';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
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
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định';
            setErrors({ submit: `Lỗi khi lưu: ${errorMessage}` });
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-2xl rounded-lg shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {editingItem ? 'Cập nhật Lịch trình' : 'Thêm Lịch trình mới'}
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} disabled:opacity-50`}
                    >
                        <X size={24} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                    </button>
                </div>

                <div className={`p-6 space-y-4 max-h-96 overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    {/* Error Message */}
                    {errors.submit && (
                        <div
                            className={`p-3 rounded-lg flex items-center gap-2 ${isDark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'
                                }`}
                        >
                            <AlertCircle size={18} />
                            {errors.submit}
                        </div>
                    )}

                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            CHỌN THIẾT BỊ {errors.smartDeviceId && <span className="text-red-500">*</span>}
                        </label>
                        <select
                            value={smartDeviceId}
                            onChange={(e) => {
                                setSmartDeviceId(e.target.value);
                                if (errors.smartDeviceId) setErrors({ ...errors, smartDeviceId: '' });
                            }}
                            className={`w-full px-4 py-2 rounded-lg border ${isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.smartDeviceId ? 'border-red-500' : ''
                                }`}
                        >
                            <option value="">-- Chọn thiết bị --</option>
                            {devices.map((device) => (
                                <option key={device.id} value={device.id}>
                                    {device.name} (ID: {device.id})
                                </option>
                            ))}
                        </select>
                        {errors.smartDeviceId && <p className="text-red-500 text-sm mt-1">{errors.smartDeviceId}</p>}
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            THỜI GIAN THỰC HIỆN {errors.scheduledTime && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="datetime-local"
                            value={scheduledTime}
                            onChange={(e) => {
                                setScheduledTime(e.target.value);
                                if (errors.scheduledTime) setErrors({ ...errors, scheduledTime: '' });
                            }}
                            className={`w-full px-4 py-2 rounded-lg border ${isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.scheduledTime ? 'border-red-500' : ''
                                }`}
                        />
                        {errors.scheduledTime && <p className="text-red-500 text-sm mt-1">{errors.scheduledTime}</p>}
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
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                                className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${isActive ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-400 text-white hover:bg-gray-500'
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
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${isDark
                            ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50'
                            : 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50'
                            }`}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Đang lưu...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==================== ICON HELPER ====================
const iconForId = (iconId) => {
    switch (iconId) {
        case 'thermometer':
            return <Thermometer size={18} />;
        case 'clock':
            return <Clock size={18} />;
        case 'home':
            return <Home size={18} />;
        default:
            return <Thermometer size={18} />;
    }
};

// ==================== MAIN AUTOMATIONS COMPONENT ====================
const Automations = () => {
    const { t } = useContext(LanguageContext);
    const { isDarkMode } = useContext(ThemeContext);

    // State Management
    const [activeTab, setActiveTab] = useState('automations');
    const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [editingAutomation, setEditingAutomation] = useState(null);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [automations, setAutomations] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [operatingId, setOperatingId] = useState(null);

    // Fetch data on component mount
    useEffect(() => {
        fetchAllData();
    }, []);

    // Clear toast after 3 seconds
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    /**
     * Fetch all required data from API
     */
    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [automationsResponse, schedulesResponse, devicesResponse] = await Promise.all([
                axiosClient.get('/Automations'),
                axiosClient.get('/Schedules'),
                axiosClient.get('/Devices')
            ]);

            const automationsWithIcons = automationsResponse.data.map((item) => ({
                ...item,
                icon: iconForId(item.iconId || 'thermometer')
            }));

            setAutomations(automationsWithIcons);
            setSchedules(schedulesResponse.data);
            setDevices(devicesResponse.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Lỗi khi tải dữ liệu';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Toggle automation active status
     */
    const handleToggleAutomation = async (id) => {
        const item = automations.find((i) => i.id === id);
        if (!item) return;

        setOperatingId(id);
        try {
            const updatedData = {
                ...item,
                isActive: !item.isActive
            };

            await axiosClient.put(`/Automations/${id}`, updatedData);

            setAutomations((prev) =>
                prev.map((it) => (it.id === id ? { ...it, isActive: !it.isActive } : it))
            );
            setToast({ message: 'Cập nhật thành công', type: 'success' });
        } catch (error) {
            console.error('Error toggling automation:', error);
            setToast({
                message: error.response?.data?.message || 'Lỗi khi cập nhật trạng thái',
                type: 'error'
            });
        } finally {
            setOperatingId(null);
        }
    };

    /**
     * Toggle schedule active status
     */
    const handleToggleSchedule = async (id) => {
        const item = schedules.find((i) => i.id === id);
        if (!item) return;

        setOperatingId(id);
        try {
            const updatedData = {
                ...item,
                isActive: !item.isActive
            };

            await axiosClient.put(`/Schedules/${id}`, updatedData);

            setSchedules((prev) =>
                prev.map((it) => (it.id === id ? { ...it, isActive: !it.isActive } : it))
            );
            setToast({ message: 'Cập nhật thành công', type: 'success' });
        } catch (error) {
            console.error('Error toggling schedule:', error);
            setToast({
                message: error.response?.data?.message || 'Lỗi khi cập nhật trạng thái',
                type: 'error'
            });
        } finally {
            setOperatingId(null);
        }
    };

    /**
     * Open edit modal for automation
     */
    const handleEditAutomation = (item) => {
        setEditingAutomation(item);
        setIsAutomationModalOpen(true);
    };

    /**
     * Open edit modal for schedule
     */
    const handleEditSchedule = (item) => {
        setEditingSchedule(item);
        setIsScheduleModalOpen(true);
    };

    /**
     * Handle add/update automation
     */
    const handleAddAutomation = (newAutomation) => {
        if (newAutomation.updated) {
            setAutomations((prev) =>
                prev.map((item) =>
                    item.id === newAutomation.id
                        ? { ...item, ...newAutomation, icon: item.icon }
                        : item
                )
            );
            setToast({ message: 'Cập nhật quy tắc thành công', type: 'success' });
        } else {
            const automationWithIcon = {
                ...newAutomation,
                icon: iconForId(newAutomation.iconId || 'thermometer')
            };
            setAutomations((prev) => [automationWithIcon, ...prev]);
            setToast({ message: 'Thêm quy tắc thành công', type: 'success' });
        }
        setEditingAutomation(null);
    };

    /**
     * Handle add/update schedule
     */
    const handleAddSchedule = (newSchedule) => {
        if (newSchedule.updated) {
            setSchedules((prev) =>
                prev.map((item) => (item.id === newSchedule.id ? newSchedule : item))
            );
            setToast({ message: 'Cập nhật lịch trình thành công', type: 'success' });
        } else {
            setSchedules((prev) => [newSchedule, ...prev]);
            setToast({ message: 'Thêm lịch trình thành công', type: 'success' });
        }
        setEditingSchedule(null);
    };

    /**
     * Delete automation with confirmation
     */
    const handleDeleteAutomation = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa quy tắc này?')) return;

        setOperatingId(id);
        try {
            await axiosClient.delete(`/Automations/${id}`);
            setAutomations((prev) => prev.filter((item) => item.id !== id));
            setToast({ message: 'Xóa quy tắc thành công', type: 'success' });
        } catch (error) {
            console.error('Error deleting automation:', error);
            setToast({ message: `Lỗi khi xóa: ${error.response?.data?.message || error.message}`, type: 'error' });
        } finally {
            setOperatingId(null);
        }
    };

    /**
     * Delete schedule with confirmation
     */
    const handleDeleteSchedule = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa lịch trình này?')) return;

        setOperatingId(id);
        try {
            await axiosClient.delete(`/Schedules/${id}`);
            setSchedules((prev) => prev.filter((item) => item.id !== id));
            setToast({ message: 'Xóa lịch trình thành công', type: 'success' });
        } catch (error) {
            console.error('Error deleting schedule:', error);
            setToast({ message: `Lỗi khi xóa: ${error.response?.data?.message || error.message}`, type: 'error' });
        } finally {
            setOperatingId(null);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                <div
                    className={`p-6 rounded-lg max-w-md w-full ${isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-600'
                        }`}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle size={24} />
                        <p className="font-semibold">Lỗi</p>
                    </div>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={fetchAllData}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h1 className={`text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t ? t('menu.automations', 'Tự động hóa') : 'Tự động hóa'}
                    </h1>

                    <div>
                        {activeTab === 'automations' ? (
                            <button
                                onClick={() => setIsAutomationModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 shadow transition-colors"
                            >
                                <Plus size={16} /> Thêm Tự Động Hóa
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsScheduleModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow transition-colors"
                            >
                                <Plus size={16} /> Thêm Lịch Trình
                            </button>
                        )}
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="flex -mb-px space-x-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('automations')}
                        className={`py-3 px-1 border-b-2 font-medium transition-colors ${activeTab === 'automations'
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t ? t('automations.tab.automations', 'Tự động hóa') : 'Tự động hóa'}
                    </button>
                    <button
                        onClick={() => setActiveTab('schedules')}
                        className={`py-3 px-1 border-b-2 font-medium transition-colors ${activeTab === 'schedules'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t ? t('automations.tab.schedules', 'Lịch trình') : 'Lịch trình'}
                    </button>
                </nav>

                {/* Automations Tab */}
                {activeTab === 'automations' ? (
                    <section>
                        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Tự động hóa của tôi
                        </h2>
                        <div className="space-y-4">
                            {automations.length > 0 ? (
                                automations.map((item) => (
                                    <AutomationRow
                                        key={item.id}
                                        item={item}
                                        onToggle={() => handleToggleAutomation(item.id)}
                                        onEdit={handleEditAutomation}
                                        isDark={isDarkMode}
                                        onDelete={handleDeleteAutomation}
                                        loading={operatingId === item.id}
                                    />
                                ))
                            ) : (
                                <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
                                    Chưa có quy tắc tự động hóa nào
                                </p>
                            )}
                        </div>
                    </section>
                ) : (
                    /* Schedules Tab */
                    <section>
                        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Lịch trình của tôi
                        </h2>
                        <div className="space-y-4">
                            {schedules.length > 0 ? (
                                schedules.map((item) => (
                                    <ScheduleRow
                                        key={item.id}
                                        item={item}
                                        onToggle={() => handleToggleSchedule(item.id)}
                                        onEdit={handleEditSchedule}
                                        isDark={isDarkMode}
                                        onDelete={handleDeleteSchedule}
                                        loading={operatingId === item.id}
                                    />
                                ))
                            ) : (
                                <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
                                    Chưa có lịch trình nào
                                </p>
                            )}
                        </div>
                    </section>
                )}
            </div>

            {/* Modals */}
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

            {/* Toast Notifications */}
            {toast && <Toast message={toast.message} type={toast.type} isDark={isDarkMode} />}
        </div>
    );
};

export default Automations;