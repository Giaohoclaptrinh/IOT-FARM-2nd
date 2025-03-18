import React, { useEffect, useState } from "react";
import { db } from "../firebase/db.config";
import { collection, onSnapshot } from "firebase/firestore";
import AddDevice from "../components/AddDevice";

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [showAddDevice, setShowAddDevice] = useState(false);

  useEffect(() => {
    // Lắng nghe dữ liệu từ Firestore theo thời gian thực
    const unsubscribe = onSnapshot(collection(db, "devices"), (snapshot) => {
      const deviceData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDevices(deviceData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh Sách Thiết Bị</h1>

      {/* Nút mở form thêm thiết bị */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowAddDevice(true)}
      >
        + Thêm thiết bị
      </button>

      {showAddDevice && <AddDevice onClose={() => setShowAddDevice(false)} />}

      <ul className="space-y-2">
        {devices.map((device) => (
          <li key={device.id} className="p-4 bg-gray-100 rounded shadow-md">
            <h3 className="text-lg font-semibold">{device.deviceName}</h3>
            <p>Loại: {device.deviceType}</p>
            <p>Trạng thái: {device.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceList;
