import React, { useState, useRef } from "react";
import { sendTemperatureHumidityData, startFakeDataGeneration } from "../Database/Services";

const TemperatureHumidityInput = ({ deviceId }) => {
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fakeDataRef = useRef(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deviceId) return;

    setLoading(true);
    await sendTemperatureHumidityData(deviceId, parseFloat(temperature), parseFloat(humidity));
    setLoading(false);

    setTemperature("");
    setHumidity("");
  };

  const toggleFakeData = () => {
    if (isGenerating) {
      if (fakeDataRef.current) {
        fakeDataRef.current(); 
        fakeDataRef.current = null;
      }
      setIsGenerating(false);
    } else {
      fakeDataRef.current = startFakeDataGeneration(deviceId); 
      setIsGenerating(true);
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
      <button
        className={`mt-4 w-full py-2 text-white text-lg font-semibold rounded-lg transition ${isGenerating ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-700"}`}
        onClick={toggleFakeData}
      >
        {isGenerating ? "Dừng tạo dữ liệu giả" : "Bắt đầu tạo dữ liệu giả"}
      </button>
    </div>
  );
};

export default TemperatureHumidityInput;
