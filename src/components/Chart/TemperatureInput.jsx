import React, { useState } from "react";
import { db } from "@/firebase/db.config";
import { doc, setDoc } from "firebase/firestore";

const TemperatureInput = ({ deviceId }) => {
  const [temperature, setTemperature] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTemperatureSubmit = async (e) => {
    e.preventDefault();
    if (!deviceId || !temperature.trim()) return;

    setLoading(true);
    try {
      const timestamp = new Date().toISOString();
      await setDoc(doc(db, `devices/${deviceId}/temperatureLogs`, timestamp), {
        temp: parseFloat(temperature),
        timestamp: new Date(),
      });

      setTemperature(""); // Reset input sau khi gửi
    } catch (error) {
      console.error("Lỗi khi gửi nhiệt độ:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleTemperatureSubmit} className="mt-4 flex items-center">
      <input
        type="number"
        value={temperature}
        onChange={(e) => setTemperature(e.target.value)}
        placeholder="Nhập nhiệt độ..."
        className="border p-2 rounded-l w-full"
        required
      />
      <button
        type="submit"
        className={`px-4 py-2 text-white rounded-r ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"}`}
        disabled={loading}
      >
        {loading ? "Đang gửi..." : "Gửi"}
      </button>
    </form>
  );
};

export default TemperatureInput;
