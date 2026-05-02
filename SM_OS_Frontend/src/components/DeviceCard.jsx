import React from 'react';

const DeviceCard = ({ device, onToggle }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '8px' }}>
            <h3>{device.name}</h3>
            <p>Loại: {device.type}</p>
            <p>Trạng thái: <strong>{device.status}</strong></p>
            <button onClick={() => onToggle(device.deviceId, device.status === 'On' ? 'Off' : 'On')}>
                {device.status === 'On' ? 'Tắt' : 'Bật'}
            </button>
        </div>
    );
};

export default DeviceCard;