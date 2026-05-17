import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PreferencesProvider } from './contexts/PreferencesContext';

// Import các trang
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import Scenes from './pages/Scenes';
import MainLayout from './components/MainLayout';
import Setting from './pages/Setting';
import Automations from './pages/Automations';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = true; // Giả sử đã đăng nhập
    return isAuthenticated ? children : <Navigate replace to="/login" />;
};

function App() {
    return (
        <LanguageProvider>
            <PreferencesProvider>
                <ThemeProvider>
                    <Router>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/regist" element={<Register />} />

                            <Route
                                path="/*"
                                element={
                                    <PrivateRoute>
                                        <MainLayout>
                                            <Routes>
                                                <Route path="/dashboard" element={<Dashboard />} />
                                                <Route path="/rooms" element={<Rooms />} />
                                                <Route path="/rooms/:roomId" element={<RoomDetail />} />
                                                <Route path="/scenes" element={<MainLayout><Scenes /></MainLayout>} />
                                                <Route path="/automations" element={<Automations />} />
                                                <Route path="/settings" element={<Setting />} />
                                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                            </Routes>
                                        </MainLayout>
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </Router>
                </ThemeProvider>
            </PreferencesProvider>
        </LanguageProvider>
    );
}

export default App;