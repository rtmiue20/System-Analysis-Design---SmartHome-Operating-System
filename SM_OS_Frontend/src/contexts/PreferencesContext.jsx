import React, { createContext, useState, useEffect } from 'react';

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
    const getInitialUnit = () => {
        try { return localStorage.getItem('pref_temp_unit') || 'C'; } catch (e) { return 'C'; }
    };
    const getInitialSystemAlerts = () => {
        try { return localStorage.getItem('pref_system_alerts') !== 'false'; } catch (e) { return true; }
    };
    const getInitialDeviceStatus = () => {
        try { return localStorage.getItem('pref_device_status') !== 'false'; } catch (e) { return true; }
    };
    const getInitialMarketing = () => {
        try { return localStorage.getItem('pref_marketing') === 'true'; } catch (e) { return false; }
    };

    const [tempUnit, setTempUnit] = useState(getInitialUnit);
    const [systemAlerts, setSystemAlerts] = useState(getInitialSystemAlerts);
    const [deviceStatus, setDeviceStatus] = useState(getInitialDeviceStatus);
    const [marketing, setMarketing] = useState(getInitialMarketing);

    useEffect(() => {
        try { localStorage.setItem('pref_temp_unit', tempUnit); } catch (e) { }
    }, [tempUnit]);

    useEffect(() => {
        try { localStorage.setItem('pref_system_alerts', systemAlerts ? 'true' : 'false'); } catch (e) { }
    }, [systemAlerts]);

    useEffect(() => {
        try { localStorage.setItem('pref_device_status', deviceStatus ? 'true' : 'false'); } catch (e) { }
    }, [deviceStatus]);

    useEffect(() => {
        try { localStorage.setItem('pref_marketing', marketing ? 'true' : 'false'); } catch (e) { }
    }, [marketing]);

    const value = {
        tempUnit,
        setTempUnit,
        systemAlerts,
        setSystemAlerts,
        deviceStatus,
        setDeviceStatus,
        marketing,
        setMarketing,
    };

    return (
        <PreferencesContext.Provider value={value}>
            {children}
        </PreferencesContext.Provider>
    );
};