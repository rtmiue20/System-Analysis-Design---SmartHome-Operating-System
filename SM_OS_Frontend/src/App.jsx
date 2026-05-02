import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang bạn đã có code
import Login from './pages/Login';
import Register from './pages/Register';
//import Dashboard from './pages/Dashboard';

const Rooms = () => <div className="p-10 text-2xl">Giao diện Phòng (Đang phát triển...)</div>;
const Scenes = () => <div className="p-10 text-2xl">Giao diện Ngữ cảnh (Đang phát triển...)</div>;
const Navbar = () => <div className="hidden">Navbar</div>; // Tạm ẩn Navbar nếu chưa có component

// Hàm kiểm tra bảo mật (Tạm thời cho qua để test giao diện)
const PrivateRoute = ({ children }) => {
    // Nếu muốn test màn hình Login, hãy đổi true thành !!localStorage.getItem('token')
    const isAuthenticated = true;
    return isAuthenticated ? children : <Navigate replace to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Trang Login */}
                <Route path="/login" element={<Login />} />
                <Route path="/regist" element={<Register />} />

                {/* Các trang chính của hệ thống */}
                <Route path="/*" element={
                    <PrivateRoute>
                        <div className="min-h-screen bg-gray-50">
                            <Navbar />
                            <Routes>
                                <Route path="/dashboard" element={<div className="p-10 text-2xl">Dashboard (Đang sửa...)</div>} />
                                <Route path="/rooms" element={<Rooms />} />
                                <Route path="/scenes" element={<Scenes />} />
                                {/* Mặc định vào Dashboard */}
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