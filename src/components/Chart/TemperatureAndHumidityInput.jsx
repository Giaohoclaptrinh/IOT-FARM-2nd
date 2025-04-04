import React, { useState, useEffect } from "react";
import { db } from "@/firebase/db.config";
import { doc, setDoc, getDoc } from "firebase/firestore";

const TemperatureHumidityInput = ({ deviceId }) => {
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAutoSending, setIsAutoSending] = useState(false); // Trạng thái tự động gửi dữ liệu

  // Hàm tạo số liệu ngẫu nhiên cho nhiệt độ và độ ẩm trong phạm vi 1-120°C và 1-100%
  const generateRandomData = () => {
    // Sinh ra giá trị ngẫu nhiên cho nhiệt độ (từ 1°C đến 120°C)
    const temperature = (Math.random() * 119 + 1).toFixed(2); // (1 đến 120)

    // Sinh ra giá trị ngẫu nhiên cho độ ẩm (từ 1% đến 100%)
    const humidity = (Math.random() * 99 + 1).toFixed(2); // (1 đến 100)

    return { temperature, humidity };
  };

  // Hàm gửi dữ liệu giả lập
  const sendData = async () => {
    const { temperature, humidity } = generateRandomData();
    const timestamp = new Date().toISOString();
    const newEntry = { timestamp, temperature: parseFloat(temperature), humidity: parseFloat(humidity) };

    try {
      const docRef = doc(db, `devices/${deviceId}/temperatureAndHumidityLogs`, deviceId);
      const docSnap = await getDoc(docRef);

      let updatedData = [];

      if (docSnap.exists()) {
        const rawData = docSnap.data().data;
        try {
          updatedData = JSON.parse(rawData || "[]");
          if (!Array.isArray(updatedData)) {
            updatedData = [];
          }
        } catch (error) {
          console.error("Lỗi khi parse JSON:", error);
          updatedData = [];
        }
      }

      updatedData.push(newEntry); // Thêm dữ liệu mới vào mảng

      await setDoc(docRef, { data: JSON.stringify(updatedData) });

      console.log("Dữ liệu đã cập nhật:", updatedData);
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
    }
  };

  // Hàm gửi dữ liệu mỗi 2 giây nếu chế độ tự động bật
  useEffect(() => {
    let intervalId;

    if (isAutoSending) {
      intervalId = setInterval(() => {
        sendData();
      }, 2000); // Gửi dữ liệu mỗi 2 giây
    } else {
      clearInterval(intervalId); // Dừng gửi khi tắt
    }

    // Cleanup khi component unmount hoặc khi tắt auto sending
    return () => clearInterval(intervalId);
  }, [isAutoSending, deviceId]);

  // Hàm xử lý gửi thủ công
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deviceId) return;

    setLoading(true);
    try {
      const timestamp = new Date().toISOString();
      const newEntry = { timestamp, temperature: parseFloat(temperature), humidity: parseFloat(humidity) };

      const docRef = doc(db, `devices/${deviceId}/temperatureAndHumidityLogs`, deviceId);
      const docSnap = await getDoc(docRef);

      let updatedData = [];

      if (docSnap.exists()) {
        const rawData = docSnap.data().data;
        try {
          updatedData = JSON.parse(rawData || "[]");
          if (!Array.isArray(updatedData)) {
            updatedData = [];
          }
        } catch (error) {
          console.error("Lỗi khi parse JSON:", error);
          updatedData = [];
        }
      }

      updatedData.push(newEntry); // Thêm dữ liệu mới vào mảng

      await setDoc(docRef, { data: JSON.stringify(updatedData) });

      console.log("Dữ liệu đã cập nhật:", updatedData);
      setTemperature("");
      setHumidity("");
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white shadow-lg rounded-lg">
      <h3 className="text-lg font-bold mb-3">🌡️ Nhập nhiệt độ & độ ẩm</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nhiệt độ (°C):</label>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="Nhập nhiệt độ"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Độ ẩm (%):</label>
            <input
              type="number"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              placeholder="Nhập độ ẩm"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className={`w-full py-2 text-white text-lg font-semibold rounded-lg transition ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"}`}
          disabled={loading}
        >
          {loading ? "Đang gửi..." : "Gửi dữ liệu"}
        </button>
      </form>
      <div className="mt-4 pb-8">
        <button
          onClick={() => setIsAutoSending(!isAutoSending)}
          className="w-full py-2 text-white text-lg font-semibold rounded-lg transition bg-green-500 hover:bg-green-700"
        >
          {isAutoSending ? "Dừng gửi dữ liệu tự động" : "Bắt đầu gửi dữ liệu tự động"}
        </button>
      </div>
    </div>
  );
};

export default TemperatureHumidityInput;
