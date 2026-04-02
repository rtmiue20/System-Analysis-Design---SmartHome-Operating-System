import React, { useState } from 'react';

const DeviceCard = ({ deviceName, deviceType }) => {
    // State lưu trạng thái Bật/Tắt của thiết bị (mặc định là tắt)
    const [isOn, setIsOn] = useState(false);

    // Hàm xử lý khi người dùng bấm nút
    const toggleDevice = () => {
        setIsOn(!isOn);
        // Sau này chỗ này sẽ là nơi gọi API sang Backend
        console.log(`Đã gửi lệnh: ${!isOn ? 'BẬT' : 'TẮT'} ${deviceName}`);
    };

    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            width: '200px',
            margin: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h3>{deviceName}</h3>
            <p>Loại: {deviceType}</p>
            <p>Trạng thái:
                <strong style={{ color: isOn ? 'green' : 'red', marginLeft: '5px' }}>
                    {isOn ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                </strong>
            </p>
            <button
                onClick={toggleDevice}
                style={{
                    backgroundColor: isOn ? '#f44336' : '#4CAF50',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%'
                }}
            >
                {isOn ? 'Tắt thiết bị' : 'Bật thiết bị'}
            </button>
        </div>
    );
};

export default DeviceCard;