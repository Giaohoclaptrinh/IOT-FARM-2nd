import React, { createContext, useState, useEffect } from "react";

export const MqttContext = createContext();

export const MqttProvider = ({ children }) => {
    const [mqttData, setMqttData] = useState(null);

    useEffect(() => {
        // Kết nối WebSocket
        const socket = new WebSocket("ws://localhost:4000");

        // Khi WebSocket mở kết nối
        socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        // Khi nhận được dữ liệu từ WebSocket
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMqttData(data); // Lưu dữ liệu MQTT vào state
        };

        // Khi WebSocket đóng kết nối
        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        // Dọn dẹp khi component unmount (đóng WebSocket)
        return () => {
            socket.close();
        };
    }, []); // Chỉ chạy một lần khi component mount

    // Cung cấp dữ liệu MQTT cho các component con
    return (
        <MqttContext.Provider value={{ mqttData }}>
            {children}
        </MqttContext.Provider>
    );
};
