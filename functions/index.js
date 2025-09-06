const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Webhook nhận dữ liệu từ TTN
exports.ttnWebhook = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { data } = req.body;

  console.log("Dữ liệu từ TTN:", data);

  try {
    const deviceId = data.end_device_ids.device_id;
    const timestamp = new Date(data.received_at);
    const pH = data.uplink_message.decoded_payload.s4_pH;
    const temperature = data.uplink_message.decoded_payload.s4_temperature; // Assuming 's4_pH_temp' might be a typo

    const docRef = admin.firestore().collection('iot-data').doc(deviceId);

    await docRef.collection('history').add({
      timestamp: timestamp,
      pH: pH,
      temperature: temperature
    });

    console.log("Dữ liệu đã được lưu vào Firestore.");
    res.status(200).send("Dữ liệu đã được nhận và lưu.");
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu:", error);
    res.status(500).send("Có lỗi xảy ra.");
  }
};
