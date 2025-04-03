import React, { useState } from "react";
import { db } from "@/firebase/db.config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import DeviceChart from "../Devices/DeviceChart";

const TemperatureHumidityInput = ({ deviceId }) => {
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!deviceId) return;

  //   setLoading(true);
  //   try {
  //     const docRef = doc(db, `devices/${deviceId}/temperatureAndHumidityLogs`, "dataString");
  //     const docSnap = await getDoc(docRef);

  //     const newEntry = `{"timestamp":"${new Date().toISOString()}","temperature":${parseFloat(temperature)},"humidity":${parseFloat(humidity)}}`;
  //     let updatedDataString = newEntry;

  //     if (docSnap.exists()) {
  //       const currentData = docSnap.data().data;
  //       updatedDataString = currentData + " ; " + newEntry;
  //     }

  //     await setDoc(docRef, { data: updatedDataString });

  //     console.log("Dữ liệu đã gửi:", updatedDataString);

  //     setTemperature("");
  //     setHumidity("");
  //   } catch (error) {
  //     console.error("Lỗi khi gửi dữ liệu:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!deviceId) return;

  setLoading(true);
  try {
    const timestamp = new Date().toISOString();
    const newEntry = { timestamp, temperature: parseFloat(temperature), humidity: parseFloat(humidity) };

    const docRef = doc(db, `devices/${deviceId}/temperatureAndHumidityLogs`, deviceId);
    const docSnap = await getDoc(docRef);

    let updatedData = []; // Đảm bảo updatedData luôn là một mảng

    if (docSnap.exists()) {
      const rawData = docSnap.data().data;
      try {
        updatedData = JSON.parse(rawData || "[]"); // Nếu null, set thành []
        if (!Array.isArray(updatedData)) {
          updatedData = []; // Nếu dữ liệu không phải mảng, reset lại
        }
      } catch (error) {
        console.error("Lỗi khi parse JSON:", error);
        updatedData = []; // Nếu lỗi parse, reset thành []
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
    </div>
  );
};

export default TemperatureHumidityInput;
