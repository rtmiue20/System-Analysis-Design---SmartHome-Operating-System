import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import DeviceCard from '../components/DeviceCard';

const Dashboard = () => {
    const [devices, setDevices] = useState([]);

    // 1. Hàm gọi API lấy danh sách thiết bị
    const fetchDevices = async () => {
        try {
            const res = await axiosClient.get('/Devices');

            if (Array.isArray(res.data)) {
                setDevices(res.data);
            } else {
                console.log("Backend trả về data không đúng định dạng:", res.data);
                setDevices([]);
            }
        } catch (err) {
            console.error("Lỗi lấy danh sách thiết bị:", err);
            setDevices([]);
        }
    };

    // 2. Chạy hàm lấy dữ liệu khi vừa mở trang
    useEffect(() => {
        // Dòng comment dưới đây giúp tắt cảnh báo màu vàng/đỏ của React/ESLint
        // eslint-disable-next-line
        fetchDevices();
    }, []);

    // 3. Hàm xử lý khi bấm nút bật/tắt
    const toggleDevice = async (id, newStatus) => {
        try {
            await axiosClient.patch(`/Devices/${id}/status`, JSON.stringify(newStatus), {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchDevices();
        } catch (error) {
            console.error("Lỗi cập nhật thiết bị:", error);
            alert("Không thể cập nhật thiết bị! Vui lòng kiểm tra lại backend.");
        }
    };

    return (
        <div>
            <h1>Bảng điều khiển thiết bị</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>

                {/* Dùng devices?.map để an toàn tuyệt đối, tránh lỗi "cannot read properties of undefined" */}
                {devices?.map(dev => (
                    <DeviceCard key={dev.deviceId} device={dev} onToggle={toggleDevice} />
                ))}

                {/* Thông báo thân thiện nếu mảng rỗng (chưa có thiết bị nào trong DB) */}
                {devices?.length === 0 && (
                    <p style={{ color: 'gray', fontStyle: 'italic', marginLeft: '10px' }}>
                        Chưa có thiết bị nào. Bạn hãy thêm thiết bị từ Database nhé!
                    </p>
                )}

            </div>
        </div>
    );
};

export default Dashboard;