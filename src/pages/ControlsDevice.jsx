import { useParams } from "react-router-dom";
import { useState } from "react";
import { startFakeDataGeneration } from "../components/Database/Services";
import { useDeviceData } from "../components/Database/useDataRealtime";

import HomeWrap from "./HomeWrap";
import ChartDynamic from "../components/Chart/ChartDynamic";
import ChartGrid from "../components/Chart/ChartGrid";
import ChartRadialBar from "../components/Chart/ChartRadialBar";
import DeviceChart from "../components/Chart/DeviceChart";

const ControlsDevice = () => {
  const { deviceUid } = useParams();
  const data = useDeviceData(deviceUid);
  const [stopGenerating, setStopGenerating] = useState(null);

  // Xử lý dữ liệu
  const latest = data[data.length - 1] || {};
  const humidity = data.map(d => ({
    x: new Date(d.timestamp),
    y: d.humidity
  }));
  const temperature = data.map(d => d.temperature);
  const humidityValues = data.map(d => d.humidity);

  const handleFakeData = () => {
    if (stopGenerating) {
      stopGenerating(); // Dừng
      setStopGenerating(null);
    } else {
      const stop = startFakeDataGeneration(deviceUid); // Bắt đầu
      setStopGenerating(() => stop);
    }
  };

  const renderFakeButton = () => (
    <button
      onClick={handleFakeData}
      className={`px-3 py-1 rounded text-white font-medium transition 
        ${stopGenerating ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
    >
      {stopGenerating ? "Dừng tạo dữ liệu giả" : "Tạo dữ liệu giả"}
    </button>
  );

  return (
    <HomeWrap>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Thiết bị: {deviceUid}</h2>

        {/* Dynamic Chart */}
        <div className="mb-6 border p-4 rounded shadow bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Biểu đồ động</h3>
            {renderFakeButton()}
          </div>
          <ChartDynamic humidity={humidity} divID="dynamic1" />
        </div>

        {/* Grid Chart */}
        <div className="mb-6 border p-4 rounded shadow bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Biểu đồ lưới</h3>
            {renderFakeButton()}
          </div>
          <ChartGrid temperatureData={temperature} humidityData={humidityValues} />
        </div>

        {/* Radial Bar Chart */}
        <div className="mb-6 border p-4 rounded shadow bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Biểu đồ vòng</h3>
            {renderFakeButton()}
          </div>
          <ChartRadialBar temperature={latest.temperature} divID="radial1" />
        </div>

        {/* Device Chart */}
        <div className="mb-6 border p-4 rounded shadow bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Biểu đồ thiết bị</h3>
            {renderFakeButton()}
          </div>
          <DeviceChart deviceId={deviceUid} />
        </div>
      </div>
    </HomeWrap>
  );
};

export default ControlsDevice;
