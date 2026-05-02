import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Thêm import ScanFace từ lucide-react
import { User, Mail, Lock, Eye, EyeOff, CheckSquare, Square, Monitor, CheckCircle, XCircle, ScanFace } from 'lucide-react';

// --- MẢNG ẢNH NỀN ---
const backgroundImages = [
    'url(https://images.pexels.com/photos/9881353/pexels-photo-9881353.jpeg)',
    'url(https://images.pexels.com/photos/12421204/pexels-photo-12421204.jpeg)',
    'url(https://images.pexels.com/photos/10653941/pexels-photo-10653941.jpeg)',
    'url(https://images.pexels.com/photos/18136105/pexels-photo-18136105.jpeg)',
    'url(https://images.pexels.com/photos/13620071/pexels-photo-13620071.jpeg)',
    'url(https://images.pexels.com/photos/18485666/pexels-photo-18485666.jpeg)'
];

// --- ĐỐI TƯỢNG STYLE TĨNH ---
const styles = {
    // Style cho thẻ card chính (hiệu ứng kính mờ tối)
    formCard: {
        backgroundColor: 'rgba(17, 24, 39, 0.6)', // gray-900 với độ trong suốt
        backdropFilter: 'blur(16px)',
        padding: '50px 60px',
        borderRadius: '30px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        width: '480px',
        textAlign: 'center',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.1)', // Viền trắng mờ tinh tế
        color: '#fff'
    },
    // Style cho nhóm input (icon + ô nhập liệu)
    inputGroup: {
        position: 'relative',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center'
    },
    // Icon bên trái ô nhập liệu
    inputIconLeft: {
        position: 'absolute',
        left: '20px',
        color: '#9ca3af' // gray-400 
    },
    // Style cho ô nhập liệu
    input: {
        width: '100%',
        padding: '16px 20px 16px 55px',
        borderRadius: '12px',
        border: '1px solid #4b5563', // gray-600
        fontSize: '15px',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(31, 41, 55, 0.5)', // gray-800 mờ
        color: 'white',
        outline: 'none',
        transition: 'all 0.3s'
    },
    // Nút bấm xanh Cyan
    submitButton: {
        backgroundColor: '#22d3ee', // cyan-400
        color: '#111827', // gray-900 
        border: 'none',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '17px',
        fontWeight: 'bold',
        width: '100%',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginTop: '10px'
    },
    // Nút bấm đăng ký mạng xã hội
    socialButton: {
        flex: 1,
        backgroundColor: 'rgba(55, 65, 81, 0.6)', // gray-700 mờ
        border: '1px solid #4b5563', // gray-600
        borderRadius: '10px',
        padding: '12px',
        color: '#d1d5db', // gray-300
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        fontWeight: '500'
    }
};

const Register = () => {
    // --- 1. QUẢN LÝ STATE ---
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [modalState, setModalState] = useState('none');
    const [bgIndex, setBgIndex] = useState(0);

    const navigate = useNavigate();

    // --- 2. HIỆU ỨNG (EFFECTS) ---
    // Hiệu ứng đổi ảnh nền (đồng bộ với Login)
    useEffect(() => {
        const bgTimer = setInterval(() => setBgIndex((prev) => (prev + 1) % backgroundImages.length), 5000);
        return () => clearInterval(bgTimer);
    }, []);

    // Hiệu ứng tự động tắt thông báo sau 3 giây
    useEffect(() => {
        if (modalState !== 'none') {
            const timer = setTimeout(() => setModalState('none'), 3000);
            return () => clearTimeout(timer);
        }
    }, [modalState]);

    // --- 3. HÀM XỬ LÝ SỰ KIỆN (EVENT HANDLERS) ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Đã chuyển thành async function để gọi API
    const handleRegister = async (e) => {
        e.preventDefault();
        const { username, email, password, confirmPassword } = formData;

        // BẮT ĐẦU VALIDATE DỮ LIỆU
        // Kiểm tra các trường trống
        if (!username || !email || !password || !confirmPassword) {
            setModalState('errorEmptyFields'); return;
        }
        // Kiểm tra định dạng Email
        if (!email.includes('@')) {
            setModalState('errorEmailFormat'); return;
        }
        // Kiểm tra độ mạnh mật khẩu (ít nhất 6 ký tự, có chữ và số)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(password)) {
            setModalState('errorPasswordStrength'); return;
        }
        // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
        if (password !== confirmPassword) {
            setModalState('errorPasswordMismatch'); return;
        }
        // Kiểm tra hộp kiểm điều khoản
        if (!agreeTerms) {
            setModalState('errorTerms'); return;
        }

        // --- GỌI API LƯU XUỐNG DATABASE ---
        try {
            const response = await fetch('http://localhost:5000/api/Users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                }),
            });

            if (response.ok) {
                // Nếu backend trả về thành công (HTTP status 200-299)
                setModalState('success');
                setTimeout(() => navigate('/login'), 2000); // Chuyển sang trang đăng nhập sau 2 giây
            } else {
                // Nếu backend trả về lỗi (VD: Email đã tồn tại)
                setModalState('errorServer');
            }
        } catch (error) {
            console.error("Lỗi khi kết nối đến server:", error);
            setModalState('errorServer');
        }
    };

    // --- 4. HÀM HỖ TRỢ RENDER (HELPER FUNCTIONS) ---
    // Hàm lấy nội dung và style cho thanh thông báo Toast
    const getModalContent = () => {
        switch (modalState) {
            case 'success': return { icon: <CheckCircle color="#2ecc71" size={24} />, text: 'Đăng ký thành công! Chuyển trang...', borderColor: '#2ecc71' };
            case 'errorEmptyFields': return { icon: <XCircle color="#e74c3c" size={24} />, text: 'Vui lòng điền đầy đủ thông tin.', borderColor: '#e74c3c' };
            case 'errorEmailFormat': return { icon: <XCircle color="#e74c3c" size={24} />, text: 'Địa chỉ Email không đúng định dạng.', borderColor: '#e74c3c' };
            case 'errorPasswordStrength': return { icon: <XCircle color="#e74c3c" size={24} />, text: 'Mật khẩu cần ít nhất 6 ký tự, gồm cả chữ và số.', borderColor: '#e74c3c' };
            case 'errorPasswordMismatch': return { icon: <XCircle color="#e74c3c" size={24} />, text: 'Mật khẩu xác nhận không khớp.', borderColor: '#e74c3c' };
            case 'errorTerms': return { icon: <XCircle color="#e74c3c" size={24} />, text: 'Vui lòng đồng ý với Điều khoản dịch vụ.', borderColor: '#e74c3c' };
            case 'errorServer': return { icon: <XCircle color="#e74c3c" size={24} />, text: 'Lỗi máy chủ hoặc tài khoản đã tồn tại!', borderColor: '#e74c3c' }; // Thêm case xử lý lỗi server
            default: return { icon: '', text: '', borderColor: 'transparent' };
        }
    };

    // Hàm render thanh thông báo Toast
    const renderToast = () => {
        const content = getModalContent();
        return (
            <div style={{
                position: 'fixed', top: modalState !== 'none' ? '20px' : '-100px', right: '20px',
                backgroundColor: 'rgba(31, 41, 55, 0.9)', backdropFilter: 'blur(10px)',
                padding: '15px 25px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                display: 'flex', alignItems: 'center', gap: '15px', zIndex: 9999,
                transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                borderLeft: `6px solid ${content.borderColor}`, color: '#fff'
            }}>
                {content.icon}
                <span style={{ fontSize: '15px', fontWeight: '600' }}>{content.text}</span>
                <div onClick={() => setModalState('none')} style={{ marginLeft: '10px', cursor: 'pointer', color: '#999', fontWeight: 'bold' }}>✕</div>
            </div>
        );
    };

    // Hàm render một ô nhập liệu (Input Group)
    const renderInputGroup = (icon, type, name, placeholder, value, isPassword, showPassState, setShowPassAction) => (
        <div style={styles.inputGroup}>
            <div style={styles.inputIconLeft}>{icon}</div>
            <input
                type={isPassword && showPassState ? 'text' : type}
                name={name}
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                required
            />
            {isPassword && (
                <span
                    style={{ position: 'absolute', right: '20px', cursor: 'pointer', color: '#9ca3af', fontSize: '18px' }}
                    onClick={() => setShowPassAction(!showPassState)}
                >
                    {showPassState ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
            )}
        </div>
    );

    // Hàm render thẻ card đăng ký chính
    const renderRegisterCard = () => (
        <div style={styles.formCard}>
            {/* ICON TRÊN CÙNG */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '15px', border: '2px solid #22d3ee', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(34, 211, 238, 0.1)', boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)' }}>
                    <Monitor className="text-cyan-400" size={30} />
                </div>
            </div>

            {/* TIÊU ĐỀ */}
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>Tạo tài khoản mới</h1>
            <p style={{ fontSize: '15px', color: '#d1d5db', marginBottom: '35px' }}>Đăng ký để bắt đầu quản lý ngôi nhà của bạn</p>

            {/* BIỂU MẪU ĐĂNG KÝ */}
            <form onSubmit={handleRegister}>
                <div style={{ textAlign: 'left' }}>
                    {/* Các trường nhập liệu */}
                    {renderInputGroup(<User size={18} />, 'text', 'username', 'Tên đăng nhập', formData.username)}
                    {renderInputGroup(<Mail size={18} />, 'email', 'email', 'Địa chỉ Email', formData.email)}
                    {renderInputGroup(<Lock size={18} />, 'password', 'password', 'Mật khẩu', formData.password, true, showPassword, setShowPassword)}
                    {renderInputGroup(<Lock size={18} />, 'password', 'confirmPassword', 'Xác nhận mật khẩu', formData.confirmPassword, true, showConfirmPassword, setShowConfirmPassword)}
                </div>

                {/* HỘP KIỂM ĐIỀU KHOẢN */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', marginBottom: '25px', color: '#d1d5db', fontSize: '14px' }}>
                    <span onClick={() => setAgreeTerms(!agreeTerms)} style={{ cursor: 'pointer' }}>
                        {agreeTerms ? <CheckSquare size={20} color="#22d3ee" /> : <Square size={20} />}
                    </span>
                    <label style={{ cursor: 'pointer' }} onClick={() => setAgreeTerms(!agreeTerms)}>
                        Tôi đồng ý với các Điều khoản dịch vụ và Chính sách bảo mật
                    </label>
                </div>

                {/* NÚT ĐĂNG KÝ */}
                <button type="submit" style={styles.submitButton}>Đăng ký ngay</button>
            </form>

            {/* ĐƯỜNG GẠCH NGANG "HOẶC" */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '25px 0', color: '#6b7280' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#374151' }}></div>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>HOẶC</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#374151' }}></div>
            </div>

            {/* ĐĂNG KÝ MẠNG XÃ HỘI */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <button style={styles.socialButton}>
                    <ScanFace size={18} color="#22d3ee" />
                    FaceID
                </button>
                <button style={styles.socialButton}>
                    <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                </button>
            </div>

            {/* LINK ĐĂNG NHẬP */}
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                Đã có tài khoản?{' '}
                <a style={{ color: '#22d3ee', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/login')}>
                    Đăng nhập ngay
                </a>
            </div>
        </div>
    );

    // --- 5. RENDER CHÍNH (MAIN RENDER) ---
    // Style cho toàn bộ trang (background đổi màu)
    const pageStyle = {
        backgroundImage: backgroundImages[bgIndex],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        transition: 'background-image 1.5s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        padding: '20px' // Đảm bảo thẻ card không bị tràn trên màn hình nhỏ
    };

    return (
        <div style={pageStyle}>
            {renderToast()}
            {renderRegisterCard()}
        </div>
    );
};

export default Register;