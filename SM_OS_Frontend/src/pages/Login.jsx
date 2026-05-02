import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post('/Users/login', { username, password });
            localStorage.setItem('token', response.data.token); // Lưu token để dùng sau
            alert('Đăng nhập thành công!');
            window.location.href = '/dashboard';
            localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
            console.error(error);
            alert('Sai tài khoản hoặc mật khẩu!');
        }

    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Smart Home Login</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} /><br />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default Login;