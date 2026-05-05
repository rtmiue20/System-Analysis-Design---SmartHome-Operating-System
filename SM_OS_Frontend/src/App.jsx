import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import MainLayout from './components/MainLayout';

const Scenes = () => <div className="p-10 text-2xl font-bold">Giao diện Ngữ cảnh</div>;
const Automations = () => <div className="p-10 text-2xl font-bold">Giao diện Tự động hóa</div>;
const Settings = () => <div className="p-10 text-2xl font-bold">Giao diện Cài đặt</div>;

const PrivateRoute = ({ children }) => {
    const isAuthenticated = true; // Giả sử đã đăng nhập
    return isAuthenticated ? children : <Navigate replace to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/regist" element={<Register />} />

                <Route path="/*" element={
                    <PrivateRoute>
                        <MainLayout>
                            <Routes>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/rooms" element={<Rooms />} />
                                <Route path="/rooms/:roomId" element={<RoomDetail />} />
                                <Route path="/scenes" element={<Scenes />} />
                                <Route path="/automations" element={<Automations />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                            </Routes>
                        </MainLayout>
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;