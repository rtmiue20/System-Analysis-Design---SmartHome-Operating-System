import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Scenes from './pages/Scenes';

// Hàm kiểm tra xem đã đăng nhập chưa
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate replace to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Các trang yêu cầu đăng nhập mới xem được */}
                <Route path="/*" element={
                    <PrivateRoute>
                        <>
                            <Navbar />
                            <div style={{ padding: '20px' }}>
                                <Routes>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/rooms" element={<Rooms />} />
                                    <Route path="/scenes" element={<Scenes />} />
                                    <Route path="/" element={<Navigate to="/dashboard" />} />
                                </Routes>
                            </div>
                        </>
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;