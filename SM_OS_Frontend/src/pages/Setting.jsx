import React, { useContext, useState } from 'react';
import {
    User,
    ChevronRight,
    Lock,
    ShieldCheck,
    Users,
    Cpu,
    RefreshCw,
} from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { PreferencesContext } from '../contexts/PreferencesContext';
import { themeConfig } from '../config/themeConfig';

const Toggle = ({ checked, onChange }) => (
    <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 ${checked ? 'bg-teal-400' : 'bg-gray-300 dark:bg-gray-600'
            }`}
        aria-pressed={checked}
    >
        <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-1'
                }`}
        />
    </button>
);

const Card = ({ children, className = '', theme }) => (
    <div className={`${theme.bg.card} ${theme.border.primary} rounded-xl p-6 shadow-sm border ${className}`}>
        {children}
    </div>
);

const Setting = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const theme = isDarkMode ? themeConfig.dark : themeConfig.light;
    const { lang, setLang, t } = useContext(LanguageContext);
    const {
        tempUnit, setTempUnit,
        systemAlerts, setSystemAlerts,
        deviceStatus, setDeviceStatus,
        marketing, setMarketing
    } = useContext(PreferencesContext);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [profileName, setProfileName] = useState('Alex Mercer');
    const [profileEmail, setProfileEmail] = useState('alex.mercer@example.com');
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [twoFactor, setTwoFactor] = useState(true);
    const [showChangePassword, setShowChangePassword] = useState(false);

    return (
        <div className="min-h-screen py-10 ${theme.bg.secondary}">
            <div className="w-full px-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold ${theme.text.primary}">
                        {t('settings.title')}
                    </h1>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-white/60 dark:bg-gray-800 rounded-md p-1">
                            <button
                                onClick={() => setLang('en')}
                                className={`px-3 py-1 rounded text-sm ${lang === 'en' ? 'bg-gray-900 text-white' : '${theme.text.secondary}'}`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLang('vi')}
                                className={`px-3 py-1 rounded text-sm ${lang === 'vi' ? 'bg-gray-900 text-white' : '${theme.text.secondary}'}`}
                            >
                                VI
                            </button>
                        </div>

                        <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800 rounded-md p-1">
                            <button
                                onClick={() => toggleTheme(false)}
                                className={`px-3 py-1 rounded text-sm ${!isDarkMode ? 'bg-gray-900 text-white' : '${theme.text.secondary}'}`}
                            >
                                {t('settings.light')}
                            </button>
                            <button
                                onClick={() => toggleTheme(true)}
                                className={`px-3 py-1 rounded text-sm ${isDarkMode ? 'bg-gray-900 text-white' : '${theme.text.secondary}'}`}
                            >
                                {t('settings.dark')}
                            </button>
                            <button
                                onClick={() => toggleTheme(null)}
                                className="px-2 py-1 rounded text-sm text-gray-500 dark:${theme.text.tertiary}"
                                title="Resume automatic mode"
                            >
                                Auto
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="flex items-center justify-between" theme={theme}>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-white">
                                <User size={28} />
                            </div>
                            <div>
                                <div className="text-lg font-semibold ${theme.text.primary}">{profileName}</div>
                                <div className="text-sm text-gray-400">{profileEmail}</div>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => { setEditName(profileName); setEditEmail(profileEmail); setShowEditProfile(true); }}
                                className="px-4 py-2 rounded-md bg-gray-800/60 text-white hover:bg-gray-800 transition">
                                {t('settings.profile.edit')}
                            </button>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card theme={theme}>
                                <h3 className="text-sm text-teal-400 font-semibold mb-3" >
                                    {t('settings.systemPreferences')}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium ${theme.text.secondary}">
                                                {t('settings.language')}
                                            </div>
                                            <div className="text-xs ${theme.text.tertiary}">
                                                {lang === 'vi' ? t('settings.languageValue_vi') : t('settings.languageValue_en')}
                                            </div>
                                        </div>
                                        <div className="text-teal-300 flex items-center gap-2">
                                            <button
                                                onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
                                                className="px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-800"
                                            >
                                                {lang === 'en' ? 'VI' : 'EN'}
                                            </button>
                                            <ChevronRight />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium ${theme.text.secondary}">
                                                {t('settings.theme')}
                                            </div>
                                            <div className="text-xs ${theme.text.tertiary}">
                                                {t('settings.darkMode')}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleTheme(false)}
                                                className={`px-3 py-1 rounded-md text-sm ${!isDarkMode ? 'bg-gray-800 text-white' : 'bg-transparent text-gray-500'}`}
                                            >
                                                {t('settings.light')}
                                            </button>
                                            <button
                                                onClick={() => toggleTheme(true)}
                                                className={`px-3 py-1 rounded-md text-sm ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-transparent text-gray-500'}`}
                                            >
                                                {t('settings.dark')}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:col-span-2">
                                        <div>
                                            <div className="text-sm font-medium ${theme.text.secondary}">
                                                {t('settings.temperatureUnits')}
                                            </div>
                                            <div className="text-xs ${theme.text.tertiary}">
                                                {tempUnit === 'C' ? t('settings.celsius') : t('settings.fahrenheit')}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setTempUnit('C')}
                                                className={`px-2 py-1 rounded-md ${tempUnit === 'C' ? 'bg-gray-800 text-white' : 'bg-transparent text-gray-500'}`}
                                            >
                                                °C
                                            </button>
                                            <button
                                                onClick={() => setTempUnit('F')}
                                                className={`px-2 py-1 rounded-md ${tempUnit === 'F' ? 'bg-gray-800 text-white' : 'bg-transparent text-gray-500'}`}
                                            >
                                                °F
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card theme={theme}>
                                <h3 className="text-sm text-teal-400 font-semibold mb-3">
                                    {t('settings.notifications')}
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium ${theme.text.secondary}">
                                                {t('settings.systemAlerts')}
                                            </div>
                                            <div className="text-xs ${theme.text.tertiary}">
                                                {lang === 'vi' ? 'Cảnh báo bảo mật và mạng.' : 'Critical security and network warnings.'}
                                            </div>
                                        </div>
                                        <Toggle checked={systemAlerts} onChange={setSystemAlerts} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium ${theme.text.secondary}">
                                                {t('settings.deviceStatus')}
                                            </div>
                                            <div className="text-xs ${theme.text.tertiary}">
                                                {lang === 'vi' ? 'Thiết bị ngoại tuyến và pin yếu.' : 'Offline devices and low battery alerts.'}
                                            </div>
                                        </div>
                                        <Toggle checked={deviceStatus} onChange={setDeviceStatus} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium ${theme.text.secondary}">
                                                {t('settings.marketingOffers')}
                                            </div>
                                            <div className="text-xs ${theme.text.tertiary}">
                                                {lang === 'vi' ? 'Tin tức, mẹo và nội dung khuyến mại.' : 'News, tips, and promotional content.'}
                                            </div>
                                        </div>
                                        <Toggle checked={marketing} onChange={setMarketing} />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <Card theme={theme}>
                                <h3 className="text-sm text-teal-400 font-semibold mb-3">
                                    {t('settings.securityAccess')}
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Lock size={18} className="${theme.text.tertiary}" />
                                            <div>
                                                <div className="text-sm font-medium ${theme.text.secondary}">
                                                    {t('settings.changePassword')}
                                                </div>
                                                <div className="text-xs ${theme.text.tertiary}">
                                                    {lang === 'vi' ? 'Cập nhật mật khẩu tài khoản.' : 'Update your account password.'}
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowChangePassword(true)} className="p-1 hover:text-teal-400 transition">
                                            <ChevronRight />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck size={18} className="${theme.text.tertiary}" />
                                            <div>
                                                <div className="text-sm font-medium ${theme.text.secondary}">
                                                    {t('settings.twoFactor')}
                                                </div>
                                                <div className="text-xs ${theme.text.tertiary}">
                                                    {lang === 'vi' ? 'Tăng cường bảo mật tài khoản' : 'Enhance account security'}
                                                </div>
                                            </div>
                                        </div>
                                        <Toggle checked={twoFactor} onChange={setTwoFactor} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Users size={18} className="${theme.text.tertiary}" />
                                            <div>
                                                <div className="text-sm font-medium ${theme.text.secondary}">
                                                    {t('settings.manageFamily')}
                                                </div>
                                                <div className="text-xs ${theme.text.tertiary}">
                                                    {lang === 'vi' ? 'Mời và quản lý thành viên gia đình' : 'Invite and manage household members'}
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => alert('Tính năng quản lý gia đình đang phát triển')} className="p-1 hover:text-teal-400 transition">
                                            <ChevronRight />
                                        </button>
                                    </div>
                                </div>
                            </Card>

                            <Card theme={theme}>
                                <h3 className="text-sm text-teal-400 font-semibold mb-3">
                                    {t('settings.systemInfo')}
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Cpu size={18} className="${theme.text.tertiary}" />
                                            <div>
                                                <div className="text-sm font-medium ${theme.text.secondary}">
                                                    {t('settings.hubSoftware')}
                                                </div>
                                                <div className="text-xs ${theme.text.tertiary}">
                                                    Lumina Core Hub
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => alert('Lumina Core Hub v2.4.1')} className="p-1 hover:text-teal-400 transition">
                                            <ChevronRight />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <RefreshCw size={18} className="${theme.text.tertiary}" />
                                            <div>
                                                <div className="text-sm font-medium ${theme.text.secondary}">
                                                    {t('settings.checkUpdates')}
                                                </div>
                                                <div className="text-xs ${theme.text.tertiary}">
                                                    {lang === 'vi' ? 'Kiểm tra cập nhật' : 'Check for updates'}
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => alert('Bạn đang dùng phiên bản mới nhất!')} className="p-1 hover:text-teal-400 transition">
                                            <ChevronRight />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            
            {showEditProfile && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="${theme.bg.card} rounded-2xl p-6 w-full max-w-sm space-y-4">
                        <h2 className="text-lg font-bold dark:text-white">Chỉnh sửa hồ sơ</h2>
                        <input value={editName} onChange={e => setEditName(e.target.value)}
                            placeholder="Tên" className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        <input value={editEmail} onChange={e => setEditEmail(e.target.value)}
                            placeholder="Email" className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowEditProfile(false)} className="px-4 py-2 rounded-lg ${theme.bg.tertiary} ${theme.text.secondary}">Hủy</button>
                            <button onClick={() => { setProfileName(editName); setProfileEmail(editEmail); setShowEditProfile(false); }}
                                className="px-4 py-2 rounded-lg bg-teal-500 text-white">Lưu</button>
                        </div>
                    </div>
                </div>
            )}
            {showChangePassword && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="${theme.bg.card} rounded-2xl p-6 w-full max-w-sm space-y-4">
                        <h2 className="text-lg font-bold dark:text-white">Đổi mật khẩu</h2>
                        <input type="password" placeholder="Mật khẩu hiện tại"
                            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        <input type="password" placeholder="Mật khẩu mới"
                            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        <input type="password" placeholder="Xác nhận mật khẩu mới"
                            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowChangePassword(false)} className="px-4 py-2 rounded-lg ${theme.bg.tertiary} ${theme.text.secondary}">Hủy</button>
                            <button onClick={() => setShowChangePassword(false)} className="px-4 py-2 rounded-lg bg-teal-500 text-white">Lưu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Setting;