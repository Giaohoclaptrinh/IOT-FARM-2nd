import React, { useEffect, useState } from "react";
import { db, auth } from '@/firebase/db.config';
import { collection, onSnapshot, query, where, deleteDoc, doc } from "firebase/firestore";
import AddDevice from "../Devices/AddDevice";
import EditDevice from "../Devices/EditDevice";

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null); 
  const [selectedLocation, setSelectedLocation] = useState("Tất cả");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setDevices([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, "devices"), where("userUID", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deviceData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDevices(deviceData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (deviceId) => {
    if (window.confirm("Bạn có chắc muốn xóa thiết bị này?")) {
      try {
        await deleteDoc(doc(db, "devices", deviceId));
      } catch (error) {
        console.error("Lỗi khi xóa thiết bị:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh Sách Thiết Bị</h1>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : !user ? (
        <p className="text-red-500">Bạn cần đăng nhập để xem thiết bị của mình.</p>
      ) : (
        <>
          <select
            className="border p-2 rounded mb-4"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {["Tất cả", ...new Set(devices.map((d) => d.location || "Unknown device"))].map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-800 transition"
            onClick={() => setShowAddDevice(true)}
          >
            + Thêm thiết bị
          </button>

          {showAddDevice && <AddDevice onClose={() => setShowAddDevice(false)} />}
          {selectedDevice && <EditDevice device={selectedDevice} onClose={() => setSelectedDevice(null)} />}  

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.length > 0 ? (
              devices.map((device) => (
                <div key={device.id} className="p-4 rounded-lg shadow bg-white flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{device.name || "Không có tên"}</h3>
                    <p className="text-sm text-gray-600">Mô tả: {device.description || ""}</p>
                    <p className="text-sm text-gray-600">Vị trí: {device.location || "Unknown device"}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition" 
                      onClick={() => setSelectedDevice(device)}
                    >
                      Sửa
                    </button>
                    <button 
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition" 
                      onClick={() => handleDelete(device.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Không có thiết bị nào.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceList;
