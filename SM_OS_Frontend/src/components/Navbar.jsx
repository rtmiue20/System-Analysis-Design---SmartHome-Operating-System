import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav style={{ background: '#333', color: '#fff', padding: '10px', display: 'flex', gap: '20px' }}>
            <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Thiết bị</Link>
            <Link to="/rooms" style={{ color: '#fff', textDecoration: 'none' }}>Phòng</Link>
            <Link to="/scenes" style={{ color: '#fff', textDecoration: 'none' }}>Ngữ cảnh</Link>
            <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>Đăng xuất</button>
        </nav>
    );
};

export default Navbar;