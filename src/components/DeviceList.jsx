import React, { useEffect, useState } from "react";
import { db } from "../firebase/db.config";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
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

  // Xóa thiết bị theo ID
  const handleDelete = async (deviceId) => {
    if (window.confirm("Bạn có chắc muốn xóa thiết bị này?")) {
      try {
        await deleteDoc(doc(db, "devices", deviceId));
        alert("Thiết bị đã được xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa thiết bị:", error);
      }
    }
  };

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
        {devices.length > 0 ? (
          devices.map((device) => (
            <li key={device.name} className="p-4 bg-gray-100 rounded shadow-md flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{device.name || "Không có tên"}</h3>
                {/* <p>Loại: {device.type}</p> */}
                <p>Trạng thái: {device.status}</p>
              </div>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(device.id)}
              >
                Xóa
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">Chưa có thiết bị nào.</p>
        )}
      </ul>
    </div>
  );
};

export default DeviceList;
