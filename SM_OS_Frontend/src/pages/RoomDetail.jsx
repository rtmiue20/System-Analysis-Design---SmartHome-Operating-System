import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { ArrowLeft, Lightbulb, Power } from 'lucide-react';

const RoomDetail = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [devices, setDevices] = useState([]);
    const [room, setRoom] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const [rRes, dRes] = await Promise.all([
                    axiosClient.get(`/Rooms/${roomId}`),
                    axiosClient.get(`/Devices?roomId=${roomId}`)
                ]);
                setRoom(rRes.data);
                setDevices(dRes.data);
            } catch (e) { console.error(e); }
        };
        fetchDetail();
    }, [roomId]);

    const handleToggle = async (id, currentStatus) => {
        const nextStatus = currentStatus === "On" ? "Off" : "On";
        try {
            await axiosClient.patch(`/Devices/${id}/status`, JSON.stringify(nextStatus));
            setDevices(devices.map(d => d.id === id ? { ...d, status: nextStatus } : d));
        } catch (e) { console.error(e); }
    };

    return (
        <div className="p-10">
            <button onClick={() => navigate('/rooms')} className="flex items-center gap-2 text-gray-500 font-bold mb-8">
                <ArrowLeft size={20} /> Quay lại
            </button>
            <h1 className="text-4xl font-black mb-10">{room?.name || "Chi tiết phòng"}</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {devices.map(dev => (
                    <div key={dev.id} className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-col items-center">
                        <Lightbulb size={40} className={dev.status === "On" ? "text-orange-500" : "text-gray-300"} />
                        <h4 className="font-bold mt-4">{dev.name}</h4>
                        <button
                            onClick={() => handleToggle(dev.id, dev.status)}
                            className={`mt-4 px-6 py-2 rounded-full font-bold ${dev.status === "On" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}
                        >
                            {dev.status === "On" ? "Tắt" : "Bật"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomDetail;