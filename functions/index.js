const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Webhook nhận dữ liệu từ TTN
exports.ttnWebhook = functions.https.onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const data = req.body;

  console.log("Dữ liệu từ TTN:", data);

  // Lưu dữ liệu vào Firestore (hoặc Realtime Database nếu bạn dùng)
  const deviceId = data.end_device_ids.device_id;
  const timestamp = data.received_at;
  const pH = data.uplink_message.decoded_payload.s4_pH;
  const temperature = data.uplink_message.decoded_payload.s4_pH_temp;

  // Lưu vào Firestore, dưới dạng lịch sử dữ liệu thiết bị
  const docRef = admin.firestore().collection('iot-data').doc(deviceId);
  docRef.collection('history').add({
    timestamp: timestamp,
    pH: pH,
    temperature: temperature
  })
  .then(() => {
    console.log("Dữ liệu đã được lưu vào Firestore.");
    res.status(200).send("Dữ liệu đã được nhận và lưu.");
  })
  .catch((error) => {
    console.error("Lỗi khi lưu dữ liệu:", error);
    res.status(500).send("Có lỗi xảy ra.");
  });
});
