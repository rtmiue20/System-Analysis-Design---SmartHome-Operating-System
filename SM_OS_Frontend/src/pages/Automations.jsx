import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../components/MainLayout';
import { Plus, Clock, Thermometer, Home, Edit3 } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';
import { ThemeContext } from '../contexts/ThemeContext';

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

const AutomationRow = ({ item, onToggle, onEdit, isDark }) => (
    <div className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700 text-orange-300' : 'bg-orange-50 text-orange-500'}`}>
                {item.icon}
            </div>
            <div>
                <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</div>
                <div className={`text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>{item.subtitle}</div>
                {item.condition && <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>○ {item.condition}</div>}
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button
                onClick={onEdit}
                className={`p-2 rounded-md ${isDark ? 'text-slate-300 hover:bg-white/6' : 'text-gray-500 hover:bg-gray-100'}`}
                title="Edit"
            >
                <Edit3 size={18} />
            </button>

            <Toggle checked={item.enabled} onChange={onToggle} />
        </div>
    </div>
);

const defaultAutomations = [
    { id: 'ac_on', title: 'Bật máy lạnh', subtitle: 'Phòng khách', condition: 'Nếu nhiệt độ > 30°C', enabled: true, iconId: 'thermometer' },
    { id: 'turn_off_night', title: 'Hẹn giờ tắt đèn', subtitle: 'Toàn bộ nhà', condition: 'Vào lúc 11:00 PM mỗi ngày', enabled: true, iconId: 'clock' },
    { id: 'hallway_light', title: 'Bật đèn hành lang', subtitle: 'Hành lang', condition: 'Nếu mở cửa chính (18:00 - 06:00)', enabled: false, iconId: 'home' }
];

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
    const [items, setItems] = useState(() => {
        try {
            const raw = localStorage.getItem('automations_state');
            if (raw) {
                const parsed = JSON.parse(raw);
                return parsed.map(p => ({ ...p, icon: iconForId(p.iconId || defaultAutomations.find(d => d.id === p.id)?.iconId) }));
            }
        } catch (e) { /* ignore */ }
        return defaultAutomations.map(d => ({ ...d, icon: iconForId(d.iconId) }));
    });

    useEffect(() => {
        try {
            const serializable = items.map(({ icon, ...rest }) => rest);
            localStorage.setItem('automations_state', JSON.stringify(serializable));
        } catch (e) { /* ignore */ }
    }, [items]);

    const handleToggle = (id) => setItems(prev => prev.map(it => it.id === id ? { ...it, enabled: !it.enabled } : it));
    const handleEdit = (id) => console.log('Edit automation', id);
    const handleAdd = () => {
        const id = `auto_${Date.now()}`;
        const newItem = { id, title: t?.('automations.newTitle') || 'Tự động hóa mới', subtitle: t?.('automations.newSubtitle') || 'Không gian', condition: '', enabled: false, iconId: 'clock', icon: iconForId('clock') };
        setItems(prev => [newItem, ...prev]);
    };

    // Use full-width content (like Dashboard / Rooms) — no centered max-width container
    return (
        <MainLayout>
            <div className={`p-10 min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                <div className="w-full">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <button onClick={() => window.history.back()} className={`p-2 rounded-md ${isDarkMode ? 'text-slate-300 hover:bg-white/6' : 'text-gray-500 hover:bg-gray-100'}`}>←</button>
                            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t ? t('menu.automations', 'Tự động hóa & Lịch trình') : 'Tự động hóa & Lịch trình'}</h1>
                        </div>

                        <div>
                            <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-400 shadow">
                                <Plus size={16} /> {t ? t('automations.add', 'Thêm Tự Động Hóa') : 'Thêm Tự Động Hóa'}
                            </button>
                        </div>
                    </div>

                    <div className="border-b mb-6">
                        <nav className="flex -mb-px space-x-6">
                            <button onClick={() => setActiveTab('automations')} className={`py-3 px-1 border-b-2 font-medium ${activeTab === 'automations' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'}`}>{t ? t('automations.tab.automations', 'Tự động hóa') : 'Tự động hóa'}</button>
                            <button onClick={() => setActiveTab('schedules')} className={`py-3 px-1 border-b-2 font-medium ${activeTab === 'schedules' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'}`}>{t ? t('automations.tab.schedules', 'Lịch trình') : 'Lịch trình'}</button>
                        </nav>
                    </div>

                    {activeTab === 'automations' ? (
                        <section>
                            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tự động hóa của tôi</h2>
                            <div className="space-y-4">
                                {items.map(item => (
                                    <AutomationRow key={item.id} item={item} onToggle={() => handleToggle(item.id)} onEdit={() => handleEdit(item.id)} isDark={isDarkMode} />
                                ))}
                            </div>
                        </section>
                    ) : (
                        <section>
                            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Lịch trình</h2>
                            <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100'}`}>
                                <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Hiện chưa có lịch trình. Nhấn "Thêm Tự Động Hóa" để tạo lịch trình mới hoặc chuyển sang tab Tự động hóa.</p>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Automations;