const mqtt = require("mqtt");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Kết nối MQTT
const client = mqtt.connect("mqtts://eu1.cloud.thethings.network", {
    username: "fire-warn@ttn",
    password: "NNSXS.GMZDCPJKWKAQWY77RU54UHT7BHAUMWPF5GFQFTY.XSD7T74KSXYNLFGZ43BH2QJ5FTNZLIPMZ7RZCDPPJGAQSRYS26VQ",
});

// Sự kiện kết nối
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

client.on("close", () => {
    console.log("MQTT connection closed");
});

let latestMessage = {};

client.on("message", (topic, message) => {
    try {
        const payload = JSON.parse(message.toString());
        latestMessage = payload;
        console.log("Received message:", payload);
    } catch (err) {
        console.error("Parsing error:", err);
    }
});

app.get("/mqtt/latest", (req, res) => {
    res.json(latestMessage);
});

// Đổi PORT server MQTT sang cổng khác để không trùng Vite
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`MQTT Server listening on http://localhost:${PORT}`);
});
