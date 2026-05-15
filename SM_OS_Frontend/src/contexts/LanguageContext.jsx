import React, { createContext, useState, useEffect, useCallback } from 'react';

export const LanguageContext = createContext();

const translations = {
    en: {
        brand: 'Smarthome',
        menu: {
            dashboard: 'Dashboard',
            rooms: 'Rooms',
            automations: 'Automations',
            settings: 'Settings',
            logout: 'Logout'
        },
        login: {
            title: 'Smart Home Operating System',
            username: 'Username',
            username_placeholder: 'Enter your username',
            password: 'Password',
            password_placeholder: 'Enter your password',
            login_button: 'Login',
            remember_me: 'Remember me',
            forgot_password: 'Forgot password?',
            no_account: "Don't have an account?",
            register: 'Register here',
            demo_hint: 'Demo Credentials',
            validation_error: 'Please enter complete information!',
            success: 'Login successful! Redirecting...',
            invalid_credentials: 'Invalid username or password!',
            connection_error: 'Cannot connect to server!',
            enter_username: 'Please enter username first!'
        },
        dashboard: {
            greeting_morning: 'Good Morning!',
            greeting_afternoon: 'Good Afternoon!',
            greeting_evening: 'Good Evening!',
            scenes: 'Quick Scenes',
            devices: 'Devices',
            all_devices: 'All Devices',
            smart_automation: 'Smart & Schedules',
            areas: 'Areas',
            no_scenes: 'No scenes configured yet.',
            no_devices: 'No devices in this area.',
            no_automation: 'No schedules or automations yet.',
            no_areas: 'No areas configured yet.',
            all_off: 'All Off',
            devices_on: 'Devices On',
            notifications: 'System Notifications',
            no_notifications: 'No notifications',
            location_error: 'Unknown',
            location_permission_denied: 'Location permission denied',
            scene_activated: 'Scene activated'
        },
        rooms: {
            add_room: 'Add Room',
            room_name: 'Room Name',
            devices_count: 'Devices',
            edit: 'Edit',
            delete: 'Delete',
            no_rooms: 'No rooms available',
            confirm_delete: 'Are you sure you want to delete this room?',
            fetch_error: 'Failed to load data',
            mode_cool: 'Cool'
        },
        devices: {
            title: 'Devices',
            add_device: 'Add Device',
            device_name: 'Device Name',
            device_type: 'Device Type',
            status: 'Status',
            on: 'On',
            off: 'Off',
            control: 'Control',
            edit: 'Edit',
            delete: 'Delete',
            turned_on: 'Device turned on',
            turned_off: 'Device turned off',
            no_devices: 'No devices',
            confirm_delete: 'Are you sure you want to delete this device?',
            status_error: 'Cannot save device status'
        },
        automations: {
            title: 'Automations',
            add_automation: 'Add Automation',
            rule_name: 'Rule Name',
            condition: 'Condition',
            action: 'Action',
            active: 'Active',
            inactive: 'Inactive',
            edit: 'Edit',
            delete: 'Delete',
            enable: 'Enable',
            disable: 'Disable',
            no_automations: 'No automations configured',
            confirm_delete: 'Are you sure you want to delete this automation?'
        },
        schedules: {
            title: 'Schedules',
            add_schedule: 'Add Schedule',
            time: 'Time',
            days: 'Days',
            active: 'Active',
            edit: 'Edit',
            delete: 'Delete',
            enable: 'Enable',
            disable: 'Disable',
            no_schedules: 'No schedules'
        },
        settings: {
            title: 'Settings',
            profile: {
                name: 'Alex Mercer',
                email: 'alex.mercer@example.com',
                edit: 'Edit Profile'
            },
            systemPreferences: 'System Preferences',
            language: 'Language',
            languageValue_en: 'English (US)',
            languageValue_vi: 'Vietnamese',
            theme: 'Theme',
            darkMode: 'Dark Mode',
            light: 'Light',
            dark: 'Dark',
            auto: 'Auto',
            temperatureUnits: 'Temperature Units',
            celsius: 'Celsius (°C)',
            fahrenheit: 'Fahrenheit (°F)',
            notifications: 'Notifications',
            systemAlerts: 'System Alerts',
            deviceStatus: 'Device Status',
            marketingOffers: 'Marketing & Offers',
            securityAccess: 'Security & Access',
            changePassword: 'Change Password',
            twoFactor: 'Two-Factor Auth',
            manageFamily: 'Manage Family',
            systemInfo: 'System Info',
            luminaHub: 'Lumina Core Hub',
            checkForUpdates: 'Check for Updates'
        },
        common: {
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            add: 'Add',
            close: 'Close',
            confirm: 'Confirm',
            error: 'Error',
            success: 'Success',
            loading: 'Loading...',
            yes: 'Yes',
            no: 'No',
            logout_confirm: 'Are you sure you want to logout from the system? Your session will end immediately.'
        }
    },
    vi: {
        brand: 'Smarthome',
        menu: {
            dashboard: 'Tổng quan',
            rooms: 'Phòng',
            automations: 'Tự động hóa',
            settings: 'Cài đặt',
            logout: 'Đăng xuất'
        },
        login: {
            title: 'Hệ thống Điều hành Nhà thông minh',
            username: 'Tên đăng nhập',
            username_placeholder: 'Nhập tên đăng nhập của bạn',
            password: 'Mật khẩu',
            password_placeholder: 'Nhập mật khẩu của bạn',
            login_button: 'Đăng nhập',
            remember_me: 'Nhớ tôi',
            forgot_password: 'Quên mật khẩu?',
            no_account: 'Chưa có tài khoản?',
            register: 'Đăng ký tại đây',
            demo_hint: 'Thông tin Demo',
            validation_error: 'Vui lòng nhập đầy đủ thông tin!',
            success: 'Đăng nhập thành công! Đang chuyển hướng...',
            invalid_credentials: 'Tên đăng nhập hoặc mật khẩu không đúng!',
            connection_error: 'Không thể kết nối đến máy chủ!',
            enter_username: 'Vui lòng nhập tên đăng nhập trước!'
        },
        dashboard: {
            greeting_morning: 'Chào buổi sáng!',
            greeting_afternoon: 'Chào buổi chiều!',
            greeting_evening: 'Chào buổi tối!',
            scenes: 'Ngữ cảnh nhanh',
            devices: 'Thiết bị',
            all_devices: 'Tất cả thiết bị',
            smart_automation: 'Thông minh & Lịch trình',
            areas: 'Khu vực',
            no_scenes: 'Chưa có ngữ cảnh nào được thiết lập.',
            no_devices: 'Không có thiết bị nào trong khu vực này.',
            no_automation: 'Chưa có lịch trình hay tự động hóa nào.',
            no_areas: 'Chưa có khu vực nào được thiết lập.',
            all_off: 'Tất cả đã tắt',
            devices_on: 'Thiết bị đang bật',
            notifications: 'Thông báo hệ thống',
            no_notifications: 'Chưa có thông báo nào',
            location_error: 'Không xác định',
            location_permission_denied: 'Chưa cấp quyền vị trí',
            scene_activated: 'Đã kích hoạt ngữ cảnh'
        },
        rooms: {
            add_room: 'Thêm phòng',
            room_name: 'Tên phòng',
            devices_count: 'Thiết bị',
            edit: 'Chỉnh sửa',
            delete: 'Xóa',
            no_rooms: 'Không có phòng nào',
            confirm_delete: 'Bạn có chắc muốn xóa phòng này?',
            fetch_error: 'Không thể tải dữ liệu',
            mode_cool: 'Làm mát'
        },
        devices: {
            title: 'Thiết bị',
            add_device: 'Thêm thiết bị',
            device_name: 'Tên thiết bị',
            device_type: 'Loại thiết bị',
            status: 'Trạng thái',
            on: 'Bật',
            off: 'Tắt',
            control: 'Điều khiển',
            edit: 'Chỉnh sửa',
            delete: 'Xóa',
            turned_on: 'Đã bật thiết bị',
            turned_off: 'Đã tắt thiết bị',
            no_devices: 'Không có thiết bị',
            confirm_delete: 'Bạn có chắc muốn xóa thiết bị này?',
            status_error: 'Không thể lưu trạng thái thiết bị'
        },
        automations: {
            title: 'Tự động hóa',
            add_automation: 'Thêm quy tắc tự động',
            rule_name: 'Tên quy tắc',
            condition: 'Điều kiện',
            action: 'Hành động',
            active: 'Hoạt động',
            inactive: 'Không hoạt động',
            edit: 'Chỉnh sửa',
            delete: 'Xóa',
            enable: 'Kích hoạt',
            disable: 'Vô hiệu hóa',
            no_automations: 'Chưa có tự động hóa nào',
            confirm_delete: 'Bạn có chắc muốn xóa tự động hóa này?'
        },
        schedules: {
            title: 'Lịch trình',
            add_schedule: 'Thêm lịch trình',
            time: 'Thời gian',
            days: 'Ngày',
            active: 'Hoạt động',
            edit: 'Chỉnh sửa',
            delete: 'Xóa',
            enable: 'Kích hoạt',
            disable: 'Vô hiệu hóa',
            no_schedules: 'Không có lịch trình'
        },
        settings: {
            title: 'Giao diện Cài đặt',
            profile: {
                name: 'Alex Mercer',
                email: 'alex.mercer@example.com',
                edit: 'Chỉnh sửa'
            },
            systemPreferences: 'Tùy chọn hệ thống',
            language: 'Ngôn ngữ',
            languageValue_en: 'English (US)',
            languageValue_vi: 'Tiếng Việt',
            theme: 'Giao diện',
            darkMode: 'Chế độ tối',
            light: 'Sáng',
            dark: 'Tối',
            auto: 'Tự động',
            temperatureUnits: 'Đơn vị nhiệt độ',
            celsius: 'Celsius (°C)',
            fahrenheit: 'Fahrenheit (°F)',
            notifications: 'Thông báo',
            systemAlerts: 'Cảnh báo hệ thống',
            deviceStatus: 'Trạng thái thiết bị',
            marketingOffers: 'Khuyến mại & Tin tức',
            securityAccess: 'Bảo mật & Truy cập',
            changePassword: 'Đổi mật khẩu',
            twoFactor: 'Xác thực 2 bước',
            manageFamily: 'Quản lý gia đình',
            systemInfo: 'Thông tin hệ thống',
            luminaHub: 'Lumina Core Hub',
            checkForUpdates: 'Kiểm tra cập nhật'
        },
        common: {
            save: 'Lưu',
            cancel: 'Hủy',
            delete: 'Xóa',
            edit: 'Chỉnh sửa',
            add: 'Thêm',
            close: 'Đóng',
            confirm: 'Xác nhận',
            error: 'Lỗi',
            success: 'Thành công',
            loading: 'Đang tải...',
            yes: 'Có',
            no: 'Không',
            logout_confirm: 'Bạn có chắc muốn đăng xuất khỏi hệ thống? Phiên làm việc của bạn sẽ kết thúc ngay lập tức.'
        }
    }
};

export const LanguageProvider = ({ children }) => {
    const getInitial = () => {
        try {
            const stored = localStorage.getItem('app_lang');
            if (stored === 'en' || stored === 'vi') return stored;
        } catch (e) { /* ignore */ }
        const lang = navigator.language?.startsWith('vi') ? 'vi' : 'en';
        return lang;
    };

    const [lang, setLang] = useState(getInitial);

    useEffect(() => {
        try { localStorage.setItem('app_lang', lang); } catch (e) { }
        document.documentElement.lang = lang === 'vi' ? 'vi' : 'en';
    }, [lang]);

    const t = useCallback(
        (path, fallback = '') => {
            if (!path) return fallback;
            const parts = path.split('.');
            let obj = translations[lang];
            for (const p of parts) {
                if (!obj) return fallback;
                obj = obj[p];
            }
            return obj ?? fallback;
        },
        [lang]
    );

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};