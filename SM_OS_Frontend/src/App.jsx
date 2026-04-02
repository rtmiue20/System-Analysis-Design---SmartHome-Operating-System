import React from 'react';
import DeviceCard from './components/DeviceCard'; // Gọi thẻ thiết bị vào

function App() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Quản lý phòng khách</h1>

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {/* Render ra 2 thiết bị mẫu */}
                <DeviceCard deviceName="Đèn trần" deviceType="Đèn" />
                <DeviceCard deviceName="Quạt đứng" deviceType="Quạt" />
            </div>
        </div>
    );
}

export default App;