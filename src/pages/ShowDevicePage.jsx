import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/db.config";
import ApexCharts from "apexcharts";

const ChartGrid = ({ divID, series, typeChart = "line" }) => {
  useEffect(() => {
    const chartOptions = {
      chart: {
        type: typeChart,
        height: 350,
        width: "100%",
        zoom: {
          autoScaleYaxis: true,
        },
      },
      series: series,
      tooltip: {
        x: {
          formatter: (val) => {
            return new Date(val).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour12: false,
              timeZone: "Asia/Ho_Chi_Minh",
            });
          },
        },
      },
      stroke: {
        show: true,
        curve: "smooth",
        width: 2,
        dashArray: 0,
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: (val) => {
            return new Date(val).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
              timeZone: "Asia/Ho_Chi_Minh",
            });
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
        style: "hollow",
      },
    };

    const chart = new ApexCharts(document.getElementById(divID), chartOptions);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [divID, series, typeChart]);

  return <div className="w-full h-80" id={divID}></div>;
};

const ShowDevicePage = () => {
  const [deviceData, setDeviceData] = useState({});

  useEffect(() => {
    const fetchAllDeviceData = async () => {
      try {
        const devicesSnapshot = await getDocs(collection(db, "devices"));
        const deviceIds = devicesSnapshot.docs.map((doc) => doc.id);

        const allData = await Promise.all(
          deviceIds.map(async (deviceId) => {
            const storageRef = collection(db, "devices", deviceId, "storageData");
            const storageSnapshot = await getDocs(storageRef);

            const dataPoints = [];

            storageSnapshot.forEach((dataDoc) => {
              const rawData = dataDoc.data();
              let pH = null,
                pH_do = null,
                pH_temp = null,
                timestamp = null;

              if (rawData.decoded_payload) {
                const payload = rawData.decoded_payload;
                pH = payload.l3_pH;
                pH_do = payload.l3_pH_do;
                pH_temp = payload.l3_pH_temp;
                timestamp = new Date(payload.received_at).getTime();
              } else if (rawData.test_pH) {
                pH = rawData.test_pH;
                pH_do = rawData.test_pH_do;
                pH_temp = rawData.test_pH_temp;
                timestamp = new Date(rawData.received_at).getTime();
              }

              if (timestamp) {
                dataPoints.push({ timestamp, pH, pH_do, pH_temp });
              }
            });

            return { deviceId, dataPoints };
          })
        );

        const deviceList = {};
        allData.forEach(({ deviceId, dataPoints }) => {
          deviceList[deviceId] = dataPoints;
        });

        setDeviceData(deviceList);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu từ Firestore:", error);
      }
    };

    fetchAllDeviceData();
  }, []);

  if (Object.keys(deviceData).length === 0) {
    return <div className="p-6">Đang tải dữ liệu thiết bị...</div>;
  }

  return (
    <div className="p-6 flex flex-col gap-y-8">
      {Object.entries(deviceData).map(([deviceId, dataPoints]) => (
        <div key={deviceId} className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Thiết bị: {deviceId}</h2>

          <ChartGrid
            divID={`chart-${deviceId}`}
            typeChart="line"
            series={[
              {
                name: "pH",
                data: dataPoints.map((d) => [d.timestamp, d.pH]),
              },
              {
                name: "DO",
                data: dataPoints.map((d) => [d.timestamp, d.pH_do]),
              },
              {
                name: "Nhiệt độ",
                data: dataPoints.map((d) => [d.timestamp, d.pH_temp]),
              },
            ]}
          />
        </div>
      ))}
    </div>
  );
};

export default ShowDevicePage;