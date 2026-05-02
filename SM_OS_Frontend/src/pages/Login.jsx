import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Monitor, ScanFace, CheckCircle, XCircle, Info } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();

    // --- STATES ---
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    // --- EFFECTS ---
    // Tự động tắt thông báo sau 3 giây
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, type: '', message: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    // --- HANDLERS ---
    const showNotification = (type, message) => {
        setToast({ show: true, type, message });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // 1. Validate cơ bản
        if (!username || !password) {
            showNotification('error', 'Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        // 2. Gọi API đăng nhập (Thay đổi URL cho khớp với Backend của bạn)
        try {
            const response = await fetch('http://localhost:5000/api/Users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Nếu backend trả về token, bạn có thể lưu lại ở đây:
                // localStorage.setItem('token', data.token);

                showNotification('success', 'Đăng nhập thành công! Đang chuyển hướng...');
                setTimeout(() => navigate('/home'), 1500);
            } else {
                // Xử lý khi HTTP status là 400, 401, 404...
                showNotification('error', 'Sai tài khoản hoặc mật khẩu!');
            }
        } catch (error) {
            // Xử lý khi server bị sập hoặc lỗi mạng
            showNotification('error', 'Không thể kết nối đến máy chủ!');
        }
    };

    const handleFeatureComingSoon = () => {
        showNotification('info', 'Tính năng này đang được phát triển!');
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        if (!username) {
            showNotification('error', 'Vui lòng nhập Username/Email trước!');
            return;
        }
        showNotification('success', 'Hướng dẫn đặt lại mật khẩu đã được gửi!');
    };

    // --- RENDER HELPERS ---
    const renderToast = () => {
        if (!toast.show) return null;

        const isSuccess = toast.type === 'success';
        const isInfo = toast.type === 'info';

        // Chọn màu và icon dựa trên loại thông báo
        let bgColor = '';
        let icon = null;
        let title = '';

        if (isSuccess) {
            bgColor = 'bg-emerald-900/95 border-emerald-500';
            icon = <CheckCircle className="text-emerald-400" size={24} />;
            title = 'Thành công';
        } else if (isInfo) {
            bgColor = 'bg-blue-900/95 border-blue-500';
            icon = <Info className="text-blue-400" size={24} />;
            title = 'Thông báo';
        } else {
            bgColor = 'bg-rose-900/95 border-rose-500';
            icon = <XCircle className="text-rose-400" size={24} />;
            title = 'Lỗi đăng nhập';
        }

        return (
            <div className={`fixed top-8 right-8 z-50 flex items-start gap-4 px-5 py-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-l-4 transition-all duration-500 animate-in slide-in-from-top-5 fade-in ${bgColor}`}>
                <div className="mt-0.5">{icon}</div>
                <div className="flex flex-col pr-4">
                    <span className="text-white font-bold text-[15px] tracking-wide mb-0.5">{title}</span>
                    <span className="text-gray-300 text-sm">{toast.message}</span>
                </div>
                <button onClick={() => setToast({ show: false, type: '', message: '' })} className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                    ✕
                </button>
            </div>
        );
    };

    // --- MAIN RENDER ---
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative font-sans"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2000&auto=format&fit=crop")' }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            {/* Notification Toast */}
            {renderToast()}

            {/* Form Container */}
            <div className="relative z-10 w-full max-w-md p-8 bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-[2rem] shadow-2xl">

                {/* Header / Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl border border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                        <Monitor className="text-cyan-400" size={24} />
                    </div>
                </div>
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Chào mừng trở lại</h2>
                    <p className="text-sm text-gray-400">Đăng nhập để quản lý ngôi nhà của bạn</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                    <div className="space-y-4 mb-6">
                        {/* Input Username/Email */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User size={18} className="text-gray-500" />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Tên đăng nhập"
                                className="w-full bg-gray-800/50 border border-gray-700 text-white text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder-gray-500"
                            />
                        </div>

                        {/* Input Password */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-500" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu"
                                className="w-full bg-gray-800/50 border border-gray-700 text-white text-sm rounded-xl py-3.5 pl-11 pr-12 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder-gray-500"
                            />
                            <div
                                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-500 hover:text-gray-300"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mb-8 text-sm">
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-800 focus:ring-cyan-500 accent-cyan-500" />
                            <span className="ml-2 text-gray-400">Ghi nhớ đăng nhập</span>
                        </label>
                        <button type="button" onClick={handleForgotPassword} className="text-cyan-400 hover:text-cyan-300 font-medium">
                            Quên mật khẩu?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-cyan-400 hover:bg-cyan-300 text-gray-900 font-bold text-[15px] py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        Đăng nhập
                    </button>
                </form>

                {/* Divider */}
                <div className="mt-8 mb-6 flex items-center">
                    <div className="flex-1 border-t border-gray-700"></div>
                    <span className="px-4 text-xs text-gray-500 font-medium tracking-widest">HOẶC</span>
                    <div className="flex-1 border-t border-gray-700"></div>
                </div>

                {/* Social Logins */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button onClick={handleFeatureComingSoon} type="button" className="flex items-center justify-center gap-2 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-xl transition-all active:scale-[0.98] text-sm text-gray-300 font-medium">
                        <ScanFace size={18} className="text-cyan-400" />
                        FaceID
                    </button>

                    <button onClick={handleFeatureComingSoon} type="button" className="flex items-center justify-center gap-2 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-xl transition-all active:scale-[0.98] text-sm text-gray-300 font-medium">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                </div>

                {/* Link Đăng ký */}
                <div className="text-center text-sm text-gray-400 mt-8">
                    Chưa có tài khoản?{' '}
                    <button
                        onClick={() => navigate('/regist')}
                        className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                        Đăng ký ngay
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Login;