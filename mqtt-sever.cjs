const mqtt = require("mqtt");
const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
app.use(cors());

// Kết nối MQTT
const client = mqtt.connect("mqtts://eu1.cloud.thethings.network", {
    username: "fire-warn@ttn",
    password: "NNSXS.GMZDCPJKWKAQWY77RU54UHT7BHAUMWPF5GFQFTY.XSD7T74KSXYNLFGZ43BH2QJ5FTNZLIPMZ7RZCDPPJGAQSRYS26VQ",
});

// WebSocket Server
const wss = new WebSocket.Server({ noServer: true });

// Lưu trữ thông tin MQTT nhận được
let latestMessage = {};

// MQTT client: khi nhận thông điệp, gửi tới tất cả WebSocket clients
client.on("connect", () => {
    console.log("MQTT connected successfully");
    client.subscribe("v3/fire-warn@ttn/devices/+/up", (err) => {
        if (err) {
            console.error("Subscribe error:", err);
        } else {
            console.log("Subscribed successfully");
        }
    });
});

client.on("error", (err) => {
    console.log("MQTT connection error:", err);
});

client.on("message", (topic, message) => {
    try {
        const payload = JSON.parse(message.toString());
        latestMessage = payload;
         console.log("Received message:", payload);

        // Gửi dữ liệu tới tất cả WebSocket clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(latestMessage));
            }
        });
    } catch (err) {
        console.error("Parsing error:", err);
    }
});

// WebSocket client connection handler
wss.on("connection", (ws) => {
    console.log("New WebSocket connection");
    ws.send(JSON.stringify(latestMessage)); // Gửi dữ liệu mới nhất khi client kết nối

    // Tắt kết nối khi client ngắt
    ws.on("close", () => {
        console.log("WebSocket client disconnected");
    });
});

// Tạo HTTP server để Express và WebSocket chia sẻ cùng một cổng
const server = app.listen(4000, () => {
    console.log("Express server listening on http://localhost:4000");
});

// Tích hợp WebSocket với HTTP server
server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
    });
});

// API để lấy dữ liệu MQTT
app.get("/mqtt/latest", (req, res) => {
    res.json(latestMessage);
});
