import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchTemperatureHumidityData,
  startFakeDataGeneration,
} from "../components/Database/Services";

import HomeWrap from "./HomeWrap";
import ChartDynamic from "../components/Chart/ChartDynamic";
import ChartGrid from "../components/Chart/ChartGrid";
import ChartRadialBar from "../components/Chart/ChartRadialBar";
import DeviceChart from "../components/Chart/DeviceChart";

const ControlsDevice = () => {
  const { deviceUid } = useParams();
  const [data, setData] = useState({ humidity: [], temperature: [] });
  const [stopGenerating, setStopGenerating] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      
      const newHumidity = Math.random() * (100 - 0) + 0; 
      const timestamp = new Date().getTime();

      setHumidityData((prevData) => [
        ...prevData,
        [timestamp, newHumidity.toFixed(1)], 
      ]);
    }, 5000); 

  
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleFakeData = () => {
    if (stopGenerating) {
      stopGenerating(); // stop
      setStopGenerating(null);
    } else {
      const stop = startFakeDataGeneration(deviceUid); // start
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
          <ChartDynamic temperatureData={data.temperature} humidityData={data.humidity} />
        </div>

        {/* Grid Chart */}
        <div className="mb-6 border p-4 rounded shadow bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Biểu đồ lưới</h3>
            {renderFakeButton()}
          </div>
          <ChartGrid temperatureData={data.temperature} humidityData={data.humidity} />
        </div>

        {/* Radial Bar Chart */}
        <div className="mb-6 border p-4 rounded shadow bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Biểu đồ vòng</h3>
            {renderFakeButton()}
          </div>
          <ChartRadialBar temperatureData={data.temperature} humidityData={data.humidity} />
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
