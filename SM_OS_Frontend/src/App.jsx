import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang bạn đã có code
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 

const Rooms = () => <div className="p-10 text-2xl">Giao diện Phòng (Đang phát triển...)</div>;
const Scenes = () => <div className="p-10 text-2xl">Giao diện Ngữ cảnh (Đang phát triển...)</div>;
const Navbar = () => <div className="hidden">Navbar</div>; // Tạm ẩn Navbar nếu chưa có component

// Hàm kiểm tra bảo mật (Tạm thời cho qua để test giao diện)
const PrivateRoute = ({ children }) => {
    // Nếu muốn bắt buộc phải Login mới vào được Dashboard, hãy đổi true thành !!localStorage.getItem('token')
    const isAuthenticated = true;
    return isAuthenticated ? children : <Navigate replace to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Trang Đăng nhập & Đăng ký */}
                <Route path="/login" element={<Login />} />
                <Route path="/regist" element={<Register />} />

                {/* Các trang chính của hệ thống (yêu cầu PrivateRoute) */}
                <Route path="/*" element={
                    <PrivateRoute>
                        <div className="min-h-screen bg-gray-50">
                            <Navbar />
                            <Routes>
                                {/* Đã gắn Component Dashboard xịn sò vào đây */}
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/rooms" element={<Rooms />} />
                                <Route path="/scenes" element={<Scenes />} />

                                {/* Mặc định vào Dashboard. Chuyển hướng /home (từ Login) về /dashboard */}
                                <Route path="/home" element={<Navigate to="/dashboard" />} />
                                <Route path="/" element={<Navigate to="/dashboard" />} />
                            </Routes>
                        </div>
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;