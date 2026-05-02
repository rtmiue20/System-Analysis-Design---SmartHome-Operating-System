import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);

    const fetchRooms = async () => {
        try {
            const res = await axiosClient.get('/Rooms');
            if (Array.isArray(res.data)) {
                setRooms(res.data);
            } else {
                setRooms([]);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách phòng:", error);
            setRooms([]);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchRooms();
    }, []);

    return (
        <div>
            <h1>Quản lý Phòng</h1>
            <ul>
                {rooms?.map(room => (
                    <li key={room.roomId}>
                        <strong>{room.roomName}</strong> - {room.description}
                    </li>
                ))}
                {rooms?.length === 0 && <p>Chưa có phòng nào trong hệ thống.</p>}
            </ul>
        </div>
    );
};

export default Rooms;