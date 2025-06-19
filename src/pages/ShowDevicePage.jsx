import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/firebase/db.config";
import ChartGrid from "@/components/Chart/ChartGrid";
import { onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";
import { getDeviceofThingPage } from "@/components/Database/Services";

// Làm mượt
const smoothData = (data, windowSize = 3) => {
  return data.map((point, idx, arr) => {
    const start = Math.max(0, idx - Math.floor(windowSize / 2));
    const end = Math.min(arr.length, idx + Math.ceil(windowSize / 2));
    const window = arr.slice(start, end).map((d) => d.y).filter((v) => v !== null);
    const avg = window.length ? window.reduce((a, b) => a + b, 0) / window.length : null;
    return { ...point, y: avg !== null ? Number(avg.toFixed(2)) : null };
  });
};

const ShowDevicePage = () => {
  const { id: pageId } = useParams(); // lấy pageId từ URL
  const [deviceData, setDeviceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevicesInPage = async (uid) => {
      try {
        const deviceIds = await getDeviceofThingPage(pageId, uid); // lấy các thiết bị của trang

        const allData = await Promise.all(
          deviceIds.map(async (deviceId) => {
            const storageRef = collection(db, "devices", deviceId, "storageData");
            const storageSnapshot = await getDocs(storageRef);

            const dataPoints = [];

            storageSnapshot.forEach((dataDoc) => {
              const rawData = dataDoc.data();
              let pH = null, pH_do = null, pH_temp = null, timestamp = null;

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
          if (deviceId && !deviceList[deviceId]) {
            const smoothed = dataPoints
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((point, idx, arr) => {
                const windowSize = 3;
                const start = Math.max(0, idx - Math.floor(windowSize / 2));
                const end = Math.min(arr.length, idx + Math.ceil(windowSize / 2));
                const window = arr.slice(start, end);
                const avg = (key) => {
                  const vals = window.map((d) => d[key]).filter((v) => v !== null && v !== undefined);
                  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
                };
                return {
                  ...point,
                  pH: avg("pH"),
                  pH_do: avg("pH_do"),
                  pH_temp: avg("pH_temp"),
                };
              });

            deviceList[deviceId] = smoothed;
          }
        });

        setDeviceData(deviceList);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu thiết bị trong trang:", err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchDevicesInPage(user.uid);
      }
    });

    return () => unsubscribe();
  }, [pageId]);

  if (loading) return <div className="p-6">Đang tải dữ liệu thiết bị...</div>;

  if (Object.keys(deviceData).length === 0) {
    return <div className="p-6 text-gray-500">Không có thiết bị nào trong trang.</div>;
  }

  return (
    <div className="p-6 flex flex-col gap-y-8">
      {Object.entries(deviceData).map(([deviceId, dataPoints]) => {
        const humidity = smoothData(dataPoints.filter((d) => d.pH_do !== null).map((d) => ({ x: d.timestamp, y: d.pH_do })));
        const temperature = smoothData(dataPoints.filter((d) => d.pH_temp !== null).map((d) => ({ x: d.timestamp, y: d.pH_temp })));
        const ph = smoothData(dataPoints.filter((d) => d.pH !== null).map((d) => ({ x: d.timestamp, y: d.pH })));

        return (
          <div key={deviceId} className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-semibold mb-4">Thiết bị: {deviceId}</h2>
            <ChartGrid divID={deviceId} humidity={humidity} temperature={temperature} ph={ph} />
          </div>
        );
      })}
    </div>
  );
};

export default ShowDevicePage;
