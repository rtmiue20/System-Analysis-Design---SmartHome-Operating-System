import React, { useState, useEffect, useRef } from 'react';
import {
    Home, Moon, Tv, Utensils, Dumbbell, Music, Sun, Coffee,
    Plus, Trash2, Edit3, Play, X, Zap, Layers, Check
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { getComponentTheme } from '../utils/themeUtils';

const API_BASE_URL = 'http://localhost:5000/api';

// Bổ sung danh sách Icon thực tế dựa trên thư viện nhập vào
const SCENE_ICONS = [
    { key: 'home', Icon: Home, label: 'Nhà mặc định' },
    { key: 'moon', Icon: Moon, label: 'Đi ngủ / Ban đêm' },
    { key: 'tv', Icon: Tv, label: 'Xem phim / Giải trí' },
    { key: 'utensils', Icon: Utensils, label: 'Bữa ăn / Nhà bếp' },
    { key: 'dumbbell', Icon: Dumbbell, label: 'Tập thể dục / GYM' },
    { key: 'music', Icon: Music, label: 'Thư giãn / Nghe nhạc' },
    { key: 'sun', Icon: Sun, label: 'Chào buổi sáng' },
    { key: 'coffee', Icon: Coffee, label: 'Nghỉ ngơi' }
];

// Bổ sung cấu trúc màu sắc thực tế phục vụ hiển thị light/dark mode
const ICON_COLORS = [
    { key: 'orange', bg: 'bg-orange-500', light: 'bg-orange-50 text-orange-500', text: 'text-orange-500' },
    { key: 'blue', bg: 'bg-blue-500', light: 'bg-blue-50 text-blue-500', text: 'text-blue-500' },
    { key: 'green', bg: 'bg-green-500', light: 'bg-green-50 text-green-500', text: 'text-green-500' },
    { key: 'purple', bg: 'bg-purple-500', light: 'bg-purple-50 text-purple-500', text: 'text-purple-500' }
];

const getIconEntry = (key) => SCENE_ICONS.find(i => i.key === key) || SCENE_ICONS[0];
const getColorEntry = (key) => ICON_COLORS.find(c => c.key === key) || ICON_COLORS[0];

// Khai báo cấu trúc form trống phục vụ reset dữ liệu
const emptyForm = { name: '', description: '', iconKey: 'home', colorKey: 'orange', deviceActions: [] };

// Định nghĩa các hàm bổ trợ cho Thiết bị và Ngữ cảnh để tránh lỗi undefined
const getSceneId = s => s?.id || s?.Id;
const getSceneName = s => s?.name || s?.Name || 'Ngữ cảnh';

const getDeviceId = d => d?.deviceId || d?.id || d?.Id || d?.smartDeviceId || d?.SmartDeviceId;
const getDeviceName = d => d?.name || d?.Name || 'Thiết bị';

const Scenes = () => {
    const { isDarkMode } = useTheme();
    const theme = getComponentTheme(isDarkMode);

    const [scenes, setScenes] = useState([]);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedScene, setSelectedScene] = useState(null);

    const [toasts, setToasts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sceneToDelete, setSceneToDelete] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showDeleteDeviceModal, setShowDeleteDeviceModal] = useState(false);
    const [deviceToRemove, setDeviceToRemove] = useState(null);

    const [form, setForm] = useState({ ...emptyForm });
    const [editingScene, setEditingScene] = useState(null);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    //console.log("👤 Current User from localStorage:", JSON.stringify(user));

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    });

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
    };

    // ====================== FETCH DATA ======================
    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);

                const [sRes, dRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/Scenes`, { headers: getAuthHeaders() }),
                    fetch(`${API_BASE_URL}/Devices`, { headers: getAuthHeaders() }),
                ]);

                // === FETCH DEVICES ===
                if (dRes.ok) {
                    const devicesData = await dRes.json() || [];
                    //console.log("📋 RAW DEVICES từ API:", devicesData);
                    setDevices(devicesData);
                }

                // === FETCH & NORMALIZE SCENES ===
                if (sRes.ok) {
                    const data = await sRes.json();
                    //console.log("🔴 RAW DATA từ /Scenes:", data);

                    const normalized = (data || []).map(s => {
                        const actions = s.sceneActions || s.actions || s.sceneDevices || [];

                        const sceneDevices = actions.map(a => ({
                            deviceId: Number(a.smartDeviceId || a.deviceId || a.SmartDeviceId),
                            targetStatus: a.targetStatus || a.TargetStatus || 'On'
                        }));

                        //console.log(`   → Scene "${getSceneName(s)}" có ${actions.length} actions`);

                        return {
                            ...s,
                            sceneDevices: sceneDevices
                        };
                    });

                    //console.log("✅ FINAL NORMALIZED Scenes:", normalized);

                    setScenes(normalized);
                    if (normalized.length > 0) setSelectedScene(normalized[0]);
                }
            } catch (e) {
                console.error(e);
                addToast('Lỗi khi tải dữ liệu', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // ====================== EXECUTE ======================
    const handleExecute = async (scene) => {
        setIsExecuting(true);
        try {
            await fetch(`${API_BASE_URL}/Scenes/${getSceneId(scene)}/execute`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            addToast(`Đã kích hoạt "${getSceneName(scene)}"!`);
        } catch {
            addToast('Lỗi khi kích hoạt ngữ cảnh', 'error');
        } finally {
            setIsExecuting(false);
        }
    };

    // ====================== ADD ======================
    const handleAdd = async () => {
        if (!form.name.trim()) return addToast('Vui lòng nhập tên ngữ cảnh', 'error');

        const userId = user?.id || user?.Id || user?.userId || user?.user_id
            || scenes[0]?.userId || scenes[0]?.UserId;
        if (!userId) {
            console.error("❌ User ID missing:", user);
            return addToast('Chưa đăng nhập hoặc thiếu User ID. Vui lòng đăng nhập lại!', 'error');
        }

        try {
            const body = {
                name: form.name.trim(),
                description: form.description?.trim() || '',
                iconKey: form.iconKey,
                colorKey: form.colorKey,
                userId: userId,
                actions: form.deviceActions.map(a => ({
                    smartDeviceId: Number(a.deviceId),
                    targetStatus: a.targetStatus || 'On'
                }))
            };

            //console.log("📤 Sending body to backend:", body);

            const res = await fetch(`${API_BASE_URL}/Scenes`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });

            const responseText = await res.text();
            //console.log("📥 Server response:", responseText);

            if (res.ok) {
                const created = JSON.parse(responseText);
                const newId = created.sceneId || created.id || created.Id;
                const normalizedCreated = {
                    id: newId,
                    name: form.name.trim(),
                    description: form.description?.trim() || '',
                    iconKey: form.iconKey,
                    colorKey: form.colorKey,
                    userId: userId,
                    sceneActions: form.deviceActions.map(a => ({
                        smartDeviceId: Number(a.deviceId),
                        targetStatus: a.targetStatus || 'On'
                    })),
                    sceneDevices: form.deviceActions.map(a => ({
                        deviceId: Number(a.deviceId),
                        smartDeviceId: Number(a.deviceId),
                        targetStatus: a.targetStatus || 'On'
                    }))
                };
                setScenes(prev => [...prev, normalizedCreated]);
                setSelectedScene(normalizedCreated);
                setShowAddModal(false);
                setForm({ ...emptyForm });
                addToast('Thêm ngữ cảnh thành công!', 'success');
            } else {
                addToast('Lỗi server: ' + (responseText || 'Bad Request'), 'error');
            }
        } catch (err) {
            console.error(err);
            addToast('Lỗi kết nối khi thêm ngữ cảnh', 'error');
        }
    };

    // ====================== EDIT ======================
    const openEdit = (scene) => {
        setEditingScene(scene);

        const actions = scene.sceneActions || scene.actions || scene.sceneDevices || [];

        setForm({
            name: getSceneName(scene),
            description: scene.description || '',
            iconKey: scene.iconKey || 'home',
            colorKey: scene.colorKey || 'orange',
            deviceActions: actions.map(a => ({
                deviceId: Number(a.smartDeviceId || a.deviceId || a.SmartDeviceId),
                targetStatus: a.targetStatus || a.TargetStatus || 'On'
            }))
        });
        setShowEditModal(true);
    };

    const handleEdit = async () => {
        if (!form.name.trim()) return addToast('Vui lòng nhập tên ngữ cảnh', 'error');
        if (!editingScene) return;

        const id = getSceneId(editingScene);

        try {
            const body = {
                name: form.name,
                description: form.description,
                iconKey: form.iconKey,
                colorKey: form.colorKey,
                userId: user?.id || user?.userId || scenes.find(s => getSceneId(s) === getSceneId(editingScene))?.userId,
                actions: form.deviceActions.map(a => ({
                    smartDeviceId: a.deviceId,
                    targetStatus: a.targetStatus,
                }))
            };

            const res = await fetch(`${API_BASE_URL}/Scenes/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });

            if (res.ok) {
                const editedDevices = form.deviceActions.map(a => ({
                    deviceId: Number(a.deviceId),
                    smartDeviceId: Number(a.deviceId),
                    targetStatus: a.targetStatus || 'On'
                }));
                const normalizedUpdated = {
                    ...editingScene,         // giữ các field gốc (id, userId...)
                    name: form.name.trim(),
                    description: form.description?.trim() || '',
                    iconKey: form.iconKey,
                    colorKey: form.colorKey,
                    sceneActions: editedDevices,
                    sceneDevices: editedDevices
                };
                setScenes(prev => prev.map(s => getSceneId(s) === id ? normalizedUpdated : s));
                if (getSceneId(selectedScene) === id) setSelectedScene(normalizedUpdated);
                setShowEditModal(false);
                setEditingScene(null);
                addToast('Cập nhật ngữ cảnh thành công!');
            } else {
                addToast('Lỗi khi cập nhật ngữ cảnh', 'error');
            }
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi cập nhật ngữ cảnh', 'error');
        }
    };

    // ====================== DELETE ======================
    const handleDelete = async () => {
        if (!sceneToDelete) return;
        setIsDeleting(true);
        const id = getSceneId(sceneToDelete);

        try {
            const res = await fetch(`${API_BASE_URL}/Scenes/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (res.ok) {
                const remaining = scenes.filter(s => getSceneId(s) !== id);
                setScenes(remaining);
                if (getSceneId(selectedScene) === id) setSelectedScene(remaining[0] || null);
                setShowDeleteModal(false);
                setSceneToDelete(null);
                addToast('Đã xóa ngữ cảnh!');
            } else {
                addToast('Lỗi khi xóa ngữ cảnh', 'error');
            }
        } catch {
            addToast('Lỗi khi xóa ngữ cảnh', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    // ====================== DEVICE HELPERS ======================
    const toggleDeviceAction = (deviceId) => {
        setForm(prev => {
            const exists = prev.deviceActions.find(a => Number(a.deviceId) === Number(deviceId));
            if (exists) {
                return {
                    ...prev,
                    deviceActions: prev.deviceActions.filter(a => Number(a.deviceId) !== Number(deviceId))
                };
            } else {
                return {
                    ...prev,
                    deviceActions: [...prev.deviceActions, { deviceId: Number(deviceId), targetStatus: 'On' }]
                };
            }
        });
    };

    const setDeviceStatus = (deviceId, status) => {
        setForm(prev => ({
            ...prev,
            deviceActions: prev.deviceActions.map(a =>
                Number(a.deviceId) === Number(deviceId)
                    ? { ...a, targetStatus: status }
                    : a
            )
        }));
    };


    const openRemoveDeviceModal = (deviceId, deviceName) => {
        setDeviceToRemove({ deviceId, deviceName });
        setShowDeleteDeviceModal(true);
    };

    const handleRemoveDevice = async () => {
        if (!deviceToRemove || !selectedScene) return;

        try {
            const currentActions = (selectedScene.sceneDevices || selectedScene.sceneActions || [])
                .filter(a => Number(a.deviceId || a.smartDeviceId) !== Number(deviceToRemove.deviceId));

            const body = {
                name: selectedScene.name,
                description: selectedScene.description || '',
                iconKey: selectedScene.iconKey,
                colorKey: selectedScene.colorKey,
                userId: user?.id || user?.Id || user?.userId || user?.user_id,
                actions: currentActions.map(a => ({
                    smartDeviceId: Number(a.deviceId || a.smartDeviceId),
                    targetStatus: a.targetStatus || 'On'
                }))
            };

            const res = await fetch(`${API_BASE_URL}/Scenes/${getSceneId(selectedScene)}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });

            if (res.ok) {
                const filteredDevices = currentActions.map(a => ({
                    deviceId: Number(a.deviceId || a.smartDeviceId),
                    smartDeviceId: Number(a.deviceId || a.smartDeviceId),
                    targetStatus: a.targetStatus || 'On'
                }));
                const normalized = {
                    ...selectedScene,
                    sceneActions: filteredDevices,
                    sceneDevices: filteredDevices
                };

                setScenes(prev => prev.map(s => getSceneId(s) === getSceneId(selectedScene) ? normalized : s));
                setSelectedScene(normalized);
                addToast(`Đã xóa "${deviceToRemove.deviceName}" khỏi ngữ cảnh!`, 'success');
            } else {
                addToast('Không thể xóa thiết bị', 'error');
            }
        } catch (err) {
            console.error(err);
            addToast('Lỗi khi xóa thiết bị', 'error');
        } finally {
            setShowDeleteDeviceModal(false);
            setDeviceToRemove(null);
        }
    };

    // ── theme shortcuts ───────────────────────────────────────────────────────
    const cardBg = isDarkMode ? 'bg-slate-800' : 'bg-white';
    const pageBg = isDarkMode ? 'bg-slate-900' : 'bg-gray-50';
    const sidebarBg = isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200';
    const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
    const textSub = isDarkMode ? 'text-slate-400' : 'text-gray-500';
    const borderClr = isDarkMode ? 'border-slate-700' : 'border-gray-100';
    const inputClass = isDarkMode
        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400';
    const hoverItem = isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50';

    // ── sub-components ────────────────────────────────────────────────────────

    // Scene card in left list
    const SceneListItem = ({ scene }) => {
        const isActive = selectedScene && getSceneId(selectedScene) === getSceneId(scene);
        const { Icon } = getIconEntry(scene.iconKey);
        const color = getColorEntry(scene.colorKey);
        const deviceCount = (scene.sceneDevices || []).length;

        return (
            <button
                onClick={() => setSelectedScene(scene)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all
                    ${isActive
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                        : `${textPrimary} ${hoverItem}`}`}
            >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                    ${isActive ? 'bg-white/20' : (isDarkMode ? 'bg-slate-700' : color.light)}`}>
                    <Icon size={18} className={isActive ? 'text-white' : color.text} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm truncate ${isActive ? 'text-white' : textPrimary}`}>
                        {getSceneName(scene)}
                    </div>
                    <div className={`text-xs mt-0.5 ${isActive ? 'text-orange-100' : textSub}`}>
                        {deviceCount} thiết bị
                    </div>
                </div>
            </button>
        );
    };

    // Device action row inside SceneForm
    const DeviceActionRow = ({ device }) => {
        const dId = getDeviceId(device);
        const action = form.deviceActions.find(a => Number(a.deviceId) === Number(dId));
        const isSelected = !!action;

        return (
            <div className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-colors
                ${isSelected
                    ? isDarkMode ? 'border-orange-500/50 bg-orange-500/10' : 'border-orange-200 bg-orange-50'
                    : `border-transparent ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}`}>
                <label className="flex items-center gap-3 cursor-pointer flex-1">
                    <div onClick={() => toggleDeviceAction(dId)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-colors
                        ${isSelected ? 'bg-orange-500 border-orange-500' : isDarkMode ? 'border-slate-500' : 'border-gray-300'}`}>
                        {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-sm font-medium ${textPrimary}`}>{getDeviceName(device)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                        {device.type || 'Device'}
                    </span>
                </label>
                {isSelected && (
                    <div className="flex items-center gap-1 ml-2">
                        {['On', 'Off'].map(s => (
                            <button key={s} onClick={() => setDeviceStatus(dId, s)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors
                                ${action.targetStatus === s
                                        ? s === 'On' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                        : isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                                {s === 'On' ? 'Bật' : 'Tắt'}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Scene form (add/edit shared)
    const SceneForm = () => (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-semibold mb-1.5">Tên ngữ cảnh *</label>
                <input
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="VD: Đi ngủ, Về nhà..."
                    autoFocus
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-orange-400 ${inputClass}`}
                />
            </div>

            {/* Description */}
            <div>
                <label className={`block text-sm font-semibold mb-1.5 ${textPrimary}`}>Mô tả</label>
                <input
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Mô tả ngắn về ngữ cảnh này..."
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-orange-400 ${inputClass}`}
                />
            </div>

            {/* Icon */}
            <div>
                <label className={`block text-sm font-semibold mb-2 ${textPrimary}`}>Biểu tượng</label>
                <div className="flex flex-wrap gap-2">
                    {SCENE_ICONS.map(({ key, Icon, label }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setForm(p => ({ ...p, iconKey: key }))}
                            title={label}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
                        ${form.iconKey === key
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-110'
                                    : isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            <Icon size={18} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Color */}
            <div>
                <label className={`block text-sm font-semibold mb-2 ${textPrimary}`}>Màu sắc</label>
                <div className="flex gap-2">
                    {ICON_COLORS.map(({ key, bg }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setForm(p => ({ ...p, colorKey: key }))}
                            className={`w-8 h-8 rounded-full ${bg} transition-all
                        ${form.colorKey === key ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                        />
                    ))}
                </div>
            </div>

            {/* Devices */}
            <div>
                <label className={`block text-sm font-semibold mb-2 ${textPrimary}`}>
                    Thiết bị thực thi
                    <span className={`ml-2 text-xs font-normal ${textSub}`}>
                        ({form.deviceActions.length} đã chọn)
                    </span>
                </label>
                <div className={`rounded-xl border ${isDarkMode ? 'border-slate-600' : 'border-gray-200'} overflow-hidden`}>
                    <div className="max-h-52 overflow-y-auto p-2 space-y-1">
                        {devices.length === 0
                            ? <p className={`text-sm text-center py-4 ${textSub}`}>Không có thiết bị</p>
                            : devices.map(d => <DeviceActionRow key={getDeviceId(d)} device={d} />)
                        }
                    </div>
                </div>
            </div>
        </div>
    );

    // ── render ────────────────────────────────────────────────────────────────
    if (loading) return (
        <div className={`flex items-center justify-center min-h-screen ${pageBg}`}>
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className={`flex min-h-screen ${pageBg}`}>

            {/* ── LEFT SIDEBAR ── */}
            <aside className={`w-64 border-r flex flex-col fixed h-screen top-0 left-64 z-30 ${sidebarBg}`}>
                {/* Header */}
                <div className={`px-5 py-5 border-b ${borderClr}`}>
                    <div className="flex items-center justify-between mb-1">
                        <h2 className={`text-lg font-bold ${textPrimary}`}>Ngữ cảnh</h2>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                            {scenes.length}
                        </span>
                    </div>
                    <p className={`text-xs ${textSub}`}>Kích hoạt nhiều thiết bị cùng lúc</p>
                </div>

                {/* Owner info */}
                <div className={`px-5 py-3 border-b ${borderClr}`}>
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                            <Zap size={16} className="text-white" />
                        </div>
                        <div>
                            <div className={`text-sm font-semibold ${textPrimary}`}>{user.name || user.username || 'Người dùng'}</div>
                            <div className={`text-xs ${textSub}`}>Quản lý ngữ cảnh</div>
                        </div>
                    </div>
                    <button
                        onClick={() => { setForm({ ...emptyForm }); setShowAddModal(true); }}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-md shadow-orange-500/20"
                    >
                        <Plus size={16} />
                        Thêm ngữ cảnh mới
                    </button>
                </div>

                {/* Scene list */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                    {scenes.length === 0
                        ? <p className={`text-sm text-center py-8 ${textSub}`}>Chưa có ngữ cảnh nào</p>
                        : scenes.map(s => <SceneListItem key={getSceneId(s)} scene={s} />)
                    }
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 ml-64 p-8">
                {!selectedScene ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                            <Layers size={36} className="text-orange-400" />
                        </div>
                        <p className={`text-lg font-semibold ${textPrimary}`}>Chưa có ngữ cảnh nào</p>
                        <p className={`text-sm ${textSub}`}>Tạo ngữ cảnh đầu tiên để điều khiển nhiều thiết bị cùng lúc</p>
                        <button onClick={() => { setForm({ ...emptyForm }); setShowAddModal(true); }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors">
                            <Plus size={18} /> Tạo ngữ cảnh
                        </button>
                    </div>
                ) : (() => {
                    const { Icon } = getIconEntry(selectedScene.iconKey);
                    const color = getColorEntry(selectedScene.colorKey);

                    const sceneDeviceActions = selectedScene.sceneDevices || selectedScene.sceneActions || [];

                        const sceneDevicesList = sceneDeviceActions.map((sd, index) => {
                            const deviceId = Number(sd.deviceId);
                            const device = devices.find(d => Number(getDeviceId(d)) === deviceId);
                            if (!device) return null;

                            const isOn = (sd.targetStatus || sd.TargetStatus) === 'On';

                            return (
                                <div
                                    key={`${deviceId}-${index}`}
                                    className={`${cardBg} rounded-2xl p-5 border ${borderClr} shadow-sm relative group hover:shadow-md transition-all`}
                                >
                                    {/* Nút Xóa - góc dưới phải */}
                                    <button
                                        onClick={() => openRemoveDeviceModal(deviceId, getDeviceName(device))}
                                        className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
                                        title="Xóa khỏi ngữ cảnh"
                                    >
                                        <Trash2 size={14} />
                                    </button>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${isOn ? `${color.bg} text-white` : isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-400'}`}>
                                            <Zap size={18} />
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-semibold
                    ${isOn ? 'bg-green-100 text-green-600' : isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                                            {isOn ? 'Bật' : 'Tắt'}
                                        </span>
                                    </div>

                                    <div className={`text-sm font-semibold ${textPrimary}`}>{getDeviceName(device)}</div>
                                    <div className={`text-xs mt-1 ${textSub}`}>{device.type || 'Thiết bị'}</div>
                                </div>
                            );
                        }).filter(Boolean);

                    return (
                        <>
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color.bg} shadow-lg`}>
                                        <Icon size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h1 className={`text-2xl font-bold ${textPrimary}`}>{getSceneName(selectedScene)}</h1>
                                        {selectedScene.description && (
                                            <p className={`text-sm mt-1 ${textSub}`}>{selectedScene.description}</p>
                                        )}
                                        <p className={`text-xs mt-1 ${textSub}`}>{sceneDevicesList.length} thiết bị</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button onClick={() => openEdit(selectedScene)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'}`}>
                                        <Edit3 size={15} /> Sửa
                                    </button>
                                    <button onClick={() => { setSceneToDelete(selectedScene); setShowDeleteModal(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors">
                                        <Trash2 size={15} /> Xóa
                                    </button>
                                    <button onClick={() => handleExecute(selectedScene)} disabled={isExecuting} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-colors disabled:opacity-60">
                                        <Play size={15} />
                                        {isExecuting ? 'Đang chạy...' : 'Kích hoạt'}
                                    </button>
                                </div>
                            </div>

                            {sceneDevicesList.length === 0 ? (
                                <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                                    <p className={`text-base font-medium ${textSub}`}>Ngữ cảnh này chưa có thiết bị nào</p>
                                    <button onClick={() => openEdit(selectedScene)} className="mt-3 text-sm text-orange-500 hover:underline">
                                        Thêm thiết bị →
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {sceneDevicesList}
                                </div>
                            )}
                        </>
                    );
                })()}
            </main>

            {/* ── ADD MODAL ── */}
            {showAddModal && (
                <div key="add-scene-modal" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className={`${cardBg} rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col`}>
                        <div className={`flex items-center justify-between px-6 py-4 border-b ${borderClr}`}>
                            <h2 className={`text-lg font-bold ${textPrimary}`}>Thêm ngữ cảnh mới</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                            >
                                <X size={18} className={textSub} />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 px-6 py-4">
                            <SceneForm />
                        </div>

                        <div className={`flex gap-3 px-6 py-4 border-t ${borderClr}`}>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors
                    ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleAdd}
                                className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── EDIT MODAL ── */}
            {showEditModal && (
                <div key="edit-scene-modal" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className={`${cardBg} rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col`}>
                        <div className={`flex items-center justify-between px-6 py-4 border-b ${borderClr}`}>
                            <h2 className={`text-lg font-bold ${textPrimary}`}>Chỉnh sửa ngữ cảnh</h2>
                            <button onClick={() => setShowEditModal(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
                                <X size={18} className={textSub} />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1 px-6 py-4">
                            <SceneForm />
                        </div>
                        <div className={`flex gap-3 px-6 py-4 border-t ${borderClr}`}>
                            <button onClick={() => setShowEditModal(false)}
                                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors
                                ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                Hủy
                            </button>
                            <button onClick={handleEdit}
                                className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-orange-500 hover:bg-orange-600 text-white transition-colors">
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DELETE MODAL ── */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className={`${cardBg} rounded-2xl w-full max-w-sm shadow-2xl p-8 flex flex-col items-center gap-4`}>
                        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                            <Trash2 size={28} className="text-red-500" />
                        </div>
                        <h2 className={`text-xl font-bold ${textPrimary}`}>Xóa ngữ cảnh</h2>
                        <p className={`text-center text-sm ${textSub}`}>
                            Bạn có chắc muốn xóa <span className="font-semibold">{sceneToDelete && getSceneName(sceneToDelete)}</span>? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex gap-3 w-full mt-2">
                            <button onClick={() => setShowDeleteModal(false)} disabled={isDeleting}
                                className={`flex-1 py-2.5 rounded-xl font-semibold transition-colors
                                ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                Hủy
                            </button>
                            <button onClick={handleDelete} disabled={isDeleting}
                                className="flex-1 py-2.5 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50">
                                {isDeleting ? 'Đang xóa...' : 'Xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== DELETE DEVICE FROM SCENE MODAL ========== */}
            {showDeleteDeviceModal && deviceToRemove && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className={`${cardBg} rounded-2xl w-full max-w-sm shadow-2xl p-8 flex flex-col items-center gap-4`}>
                        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                            <Trash2 size={28} className="text-red-500" />
                        </div>
                        <h2 className={`text-xl font-bold ${textPrimary}`}>Xóa thiết bị</h2>
                        <p className={`text-center text-sm ${textSub}`}>
                            Bạn có chắc chắn muốn xóa <span className="font-semibold">{deviceToRemove.deviceName}</span><br />
                            khỏi ngữ cảnh <span className="font-semibold">{getSceneName(selectedScene)}</span>?
                        </p>
                        <div className="flex gap-3 w-full mt-4">
                            <button
                                onClick={() => setShowDeleteDeviceModal(false)}
                                className={`flex-1 py-2.5 rounded-xl font-semibold transition-colors
                    ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleRemoveDevice}
                                className="flex-1 py-2.5 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── TOASTS ── */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto
                        ${t.type === 'error'
                                ? 'bg-red-500 text-white'
                                : 'bg-green-500 text-white'}`}>
                        {t.type === 'error' ? <X size={16} /> : <Check size={16} />}
                        {t.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Scenes;