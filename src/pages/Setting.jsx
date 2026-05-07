import React, { useContext } from 'react';
import MainLayout from '../components/MainLayout';
import { User, ChevronRight, Lock, ShieldCheck, Users, Cpu, RefreshCw } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { PreferencesContext } from '../contexts/PreferencesContext';

const Toggle = ({ checked, onChange }) => (
    <button onClick={() => onChange(!checked)} className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 ${checked ? 'bg-teal-400' : 'bg-gray-300 dark:bg-gray-600'}`} aria-pressed={checked}>
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
);

const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>{children}</div>
);

const Setting = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const { lang, setLang, t } = useContext(LanguageContext);
    const { tempUnit, setTempUnit, systemAlerts, setSystemAlerts, deviceStatus, setDeviceStatus, marketing, setMarketing } = useContext(PreferencesContext);

    // Use same full-width layout as Dashboard/Rooms (no centered narrow container)
    return (
        <MainLayout>
            <div className={`p-10 min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                <div className="w-full">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-white/60 dark:bg-gray-800 rounded-md p-1">
                                <button onClick={() => setLang('en')} className={`px-3 py-1 rounded text-sm ${lang === 'en' ? 'bg-gray-900 text-white' : 'text-gray-600 dark:text-gray-300'}`}>EN</button>
                                <button onClick={() => setLang('vi')} className={`px-3 py-1 rounded text-sm ${lang === 'vi' ? 'bg-gray-900 text-white' : 'text-gray-600 dark:text-gray-300'}`}>VI</button>
                            </div>

                            <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800 rounded-md p-1">
                                <button onClick={() => toggleTheme(false)} className={`px-3 py-1 rounded text-sm ${!isDarkMode ? 'bg-gray-900 text-white' : 'text-gray-600 dark:text-gray-300'}`}>{t('settings.light')}</button>
                                <button onClick={() => toggleTheme(true)} className={`px-3 py-1 rounded text-sm ${isDarkMode ? 'bg-gray-900 text-white' : 'text-gray-600 dark:text-gray-300'}`}>{t('settings.dark')}</button>
                                <button onClick={() => toggleTheme(null)} className="px-2 py-1 rounded text-sm text-gray-500 dark:text-gray-300" title="Resume automatic mode">Auto</button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-white"><User size={28} /></div>
                                <div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.profile.name')}</div>
                                    <div className="text-sm text-gray-400">{t('settings.profile.email')}</div>
                                </div>
                            </div>
                            <div>
                                <button className="px-4 py-2 rounded-md bg-gray-800/60 text-white hover:bg-gray-800 transition">{t('settings.profile.edit')}</button>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <h3 className="text-sm text-teal-400 font-semibold mb-3">{t('settings.systemPreferences')}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('settings.language')}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'vi' ? t('settings.languageValue_vi') : t('settings.languageValue_en')}</div>
                                            </div>
                                            <div className="text-teal-300 flex items-center gap-2">
                                                <button onClick={() => setLang(lang === 'en' ? 'vi' : 'en')} className="px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-800">{lang === 'en' ? 'VI' : 'EN'}</button>
                                                <ChevronRight />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('settings.theme')}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{t('settings.darkMode')}</div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button onClick={() => toggleTheme(false)} className={`px-3 py-1 rounded-md text-sm ${!isDarkMode ? 'bg-gray-800 text-white' : 'bg-transparent text-gray-500'}`}>{t('settings.light')}</button>
                                                <button onClick={() => toggleTheme(true)} className={`px-3 py-1 rounded-md text-sm ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-transparent text-gray-500'}`}>{t('settings.dark')}</button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:col-span-2">
                                            <div>
                                                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('settings.temperatureUnits')}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{tempUnit === 'C' ? t('settings.celsius') : t('settings.fahrenheit')}</div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setTempUnit('C')} className={`px-2 py-1 rounded-md ${tempUnit === 'C' ? 'bg-gray-800 text-white' : 'bg-transparent text-gray-500'}`}>°C</button>
                                                <button onClick={() => setTempUnit('F')} className={`px-2 py-1 rounded-md ${tempUnit === 'F' ? 'bg-gray-800 text-white' : 'bg-transparent text-gray-500'}`}>°F</button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card>
                                    <h3 className="text-sm text-teal-400 font-semibold mb-3">{t('settings.notifications')}</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('settings.systemAlerts')}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'vi' ? 'Cảnh báo bảo mật và mạng.' : 'Critical security and network warnings.'}</div>
                                            </div>
                                            <Toggle checked={systemAlerts} onChange={setSystemAlerts} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('settings.deviceStatus')}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'vi' ? 'Thiết bị ngoại tuyến và pin yếu.' : 'Offline devices and low battery alerts.'}</div>
                                            </div>
                                            <Toggle checked={deviceStatus} onChange={setDeviceStatus} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('settings.marketingOffers')}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'vi' ? 'Tin tức, mẹo và nội dung khuyến mại.' : 'News, tips, and promotional content.'}</div>
                                            </div>
                                            <Toggle checked={marketing} onChange={setMarketing} />
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <h3 className="text-sm text-teal-400 font-semibold mb-3">{t('settings.securityAccess')}</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Lock size={18} className="text-gray-300" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('settings.changePassword')}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'vi' ? 'Cập nhật mật khẩu tài khoản.' : 'Update your account password.'}</div>
                                                </div>
                                            </div>
                                            <ChevronRight />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck size={18} className="text-gray-300" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('settings.twoFactor')}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'vi' ? 'Tăng cường bảo mật tài khoản' : 'Enhance account security'}</div>
                                                </div>
                                            </div>
                                            <Toggle checked={true} onChange={() => { }} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Users size={18} className="text-gray-300" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('settings.manageFamily')}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'vi' ? 'Mời và quản lý thành viên gia đình' : 'Invite and manage household members'}</div>
                                                </div>
                                            </div>
                                            <ChevronRight />
                                        </div>
                                    </div>
                                </Card>

                                <Card>
                                    <h3 className="text-sm text-teal-400 font-semibold mb-3">{t('settings.systemInfo')}</h3>
                                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Cpu size={18} />
                                            <div>
                                                <div className="font-medium">{t('settings.luminaHub')}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'vi' ? 'Kết nối' : 'Connected'}</div>
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Firmware Version: 3.4.12-stable
                                            <br />
                                            IP Address: 192.168.1.100
                                        </div>
                                    </div>

                                    <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-400 transition">
                                        <RefreshCw size={16} />{t('settings.checkForUpdates')}
                                    </button>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Setting;