import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { db } from "@/firebase/db.config";
import { doc, onSnapshot } from "firebase/firestore";

const   TemperatureHumidityChart = ({ deviceId,arg  }) => {
  const [chartData, setChartData] = useState({
    series: [
      { name: "Nhiệt độ (°C)", data: [] },
      { name: "Độ ẩm (%)", data: [] }
    ],
    options: {
      chart: { type: "line", height: 350 },
      xaxis: { categories: [] },
      stroke: { curve: "smooth" },
      title: { text: "Biểu đồ Nhiệt độ & Độ ẩm", align: "center" },
      dataLabels: { enabled: false }
    }
  });

  useEffect(() => {
    if (!deviceId) return;

    // Lắng nghe thay đổi realtime
    const docRef = doc(db, `devices/${deviceId}/temperatureAndHumidityLogs`, deviceId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const rawData = JSON.parse(docSnap.data().data || "[]");
        if (Array.isArray(rawData)) {
          const categories = rawData.map((entry) => new Date(entry.timestamp).toLocaleTimeString());
          const temperatureData = rawData.map((entry) => entry.temperature);
          const humidityData = rawData.map((entry) => entry.humidity);

          setChartData({
            series: [
              { name: "Nhiệt độ (°C)", data: temperatureData },
              { name: "Độ ẩm (%)", data: humidityData }
            ],
            options: {
              ...chartData.options,
              xaxis: { categories }
            }
          });
        }
      }
    });

    // Cleanup listener khi component unmount hoặc deviceId thay đổi
    return () => unsubscribe();
  }, [deviceId]);

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <Chart options={chartData.options} series={chartData.series} type="line" height={350} />
    </div>
  );
};

export default TemperatureHumidityChart;
