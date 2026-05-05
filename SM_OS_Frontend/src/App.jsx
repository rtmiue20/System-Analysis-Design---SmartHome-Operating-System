import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms'; // Cần chắc chắn bạn đã tạo file này trong thư mục pages

const Scenes = () => <div className="p-10 text-2xl">Giao diện Ngữ cảnh (Đang phát triển...)</div>;
const Navbar = () => <div className="hidden">Navbar</div>;

// Hàm kiểm tra bảo mật
const PrivateRoute = ({ children }) => {
    // Để thực tế hơn, bạn có thể kiểm tra token:
    // const isAuthenticated = !!localStorage.getItem('token');
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

                {/* Các trang chính của hệ thống */}
                <Route path="/*" element={
                    <PrivateRoute>
                        <div className="min-h-screen bg-gray-50">
                            <Navbar />
                            <Routes>
                                {/* Trang chính */}
                                <Route path="/dashboard" element={<Dashboard />} />

                                {/* Sửa dòng này: Thêm :roomId để trang Rooms 
                                   biết đang hiển thị cho phòng nào (ví dụ: /rooms/1)
                                */}
                                <Route path="/rooms/:roomId" element={<Rooms />} />

                                <Route path="/scenes" element={<Scenes />} />

                                {/* Điều hướng mặc định */}
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