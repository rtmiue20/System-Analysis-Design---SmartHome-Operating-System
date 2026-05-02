import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const Scenes = () => {
    const [scenes, setScenes] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.id) {
            axiosClient.get(`/Scenes/user/${user.id}`).then(res => setScenes(res.data));



        }
    }, [user.id]);

    const executeScene = async (id) => {
        try {
            await axiosClient.post(`/Scenes/${id}/execute`);
            alert("Đã kích hoạt ngữ cảnh!");
        } catch {
            alert("Lỗi kích hoạt!");
        }
    };

    return (
        <div>
            <h1>Ngữ cảnh thông minh</h1>
            {scenes.map(s => (
                <div key={s.id} style={{ border: '1px blue solid', margin: '10px', padding: '10px' }}>
                    <span>{s.name}</span>
                    <button onClick={() => executeScene(s.id)} style={{ marginLeft: '10px' }}>Chạy</button>
                </div>
            ))}
        </div>
    );
};

export default Scenes;