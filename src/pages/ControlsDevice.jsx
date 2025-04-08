import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTemperatureHumidityData } from "../components/Database/Services";
import HomeWrap from "./HomeWrap";
import ChartDynamic from "../components/Chart/ChartDynamic";
import ChartGrid from "../components/Chart/ChartGrid";
import ChartRadialBar from "../components/Chart/ChartRadialBar";
import DeviceChart from "../components/Chart/DeviceChart";

const ControlsDevice = () => {
  const { deviceUid } = useParams();
  const [data, setData] = useState({ humidity: [], temperature: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchTemperatureHumidityData(deviceUid);
      if (result) setData(result);
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 3000); // Update every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [deviceUid]);

  return (
    <HomeWrap>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Device: {deviceUid}</h2>

        {/* Dynamic Chart */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Dynamic Chart</h3>
          <ChartDynamic temperatureData={data.temperature} humidityData={data.humidity} />
        </div>

        {/* Grid Chart */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Grid Chart</h3>
          <ChartGrid temperatureData={data.temperature} humidityData={data.humidity} />
        </div>

        {/* Radial Bar Chart */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Radial Bar Chart</h3>
          <ChartRadialBar temperatureData={data.temperature} humidityData={data.humidity} />
        </div>

        {/* Device Chart */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Device Chart</h3>
          <DeviceChart deviceId={deviceUid} />
        </div>
      </div>
    </HomeWrap>
  );
};

export default ControlsDevice;
