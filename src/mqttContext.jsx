import React, { createContext, useState, useEffect } from "react";

export const MqttContext = createContext();

export const MqttProvider = ({ children }) => {
    const [mqttData, setMqttData] = useState(null);

    // Lấy dữ liệu từ server MQTT sau mỗi 3 giây
    useEffect(() => {
        const interval = setInterval(() => {
            fetch("http://localhost:4000/mqtt/latest")
                .then(res => res.json())   // Dữ liệu nhận được là JSON
                .then(data => setMqttData(data))  // Lưu dữ liệu vào state
                .catch(err => console.error("MQTT fetch error:", err));
        }, 3000);

        // Dọn dẹp interval khi component unmount
        return () => clearInterval(interval);
    }, []);

    // Cung cấp dữ liệu MQTT cho các component con
    return (
        <MqttContext.Provider value={{ mqttData }}>
            {children}
        </MqttContext.Provider>
    );
};
