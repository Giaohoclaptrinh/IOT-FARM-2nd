import React, { useState, useEffect } from "react";
import { db, auth } from "@/firebase/db.config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import TemperatureChart from "@/components/Chart/TemperatureChart";
import TemperatureInput from "@/components/Chart/TemperatureInput";

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "devices"), where("userUID", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deviceList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDevices(deviceList);
      if (deviceList.length > 0) setDeviceId(deviceList[0].id);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🌡️ Quản lý Nhiệt độ Thiết bị</h1>

      <div className="mb-4">
        <label className="block font-medium">Chọn thiết bị:</label>
        <select
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
        >
          {devices.length > 0 ? (
            devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name || `Thiết bị ${device.id}`}
              </option>
            ))
          ) : (
            <option disabled>Không có thiết bị nào</option>
          )}
        </select>
      </div>

      {deviceId && <TemperatureChart deviceId={deviceId} />}
      {deviceId && <TemperatureInput deviceId={deviceId} />}
    </div>
  );
};

export default Dashboard;
