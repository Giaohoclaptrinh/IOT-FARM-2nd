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
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-800 transition"
        onClick={() => setShowAddDevice(true)}
      >
        + Thêm thiết bị
      </button>

      {showAddDevice && <AddDevice onClose={() => setShowAddDevice(false)} />}

      <ul className="space-y-2">
        {devices.length > 0 ? (
          devices.map((device) => (
            <li key={device.name} className="p-4 bg-gray-100 rounded shadow-md flex justify-between items-center hover:bg-gray-400 transition">
              <div>
                <h3 className="text-lg font-semibold">{device.name || "Không có tên"}</h3>
                {/* <p>Loại: {device.type}</p> */}
                <p>Trạng thái: {device.status}</p>
              </div>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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




  // return (
  //   <div className="bg-white p-6 rounded-lg shadow-md">
  //     <h2 className="text-2xl font-bold mb-4 text-gray-800">📡 Danh Sách Thiết Bị</h2>

  //     <button className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
  //       + Thêm thiết bị
  //     </button>

  //     <div className="space-y-4">
  //       {devices.map((device) => (
  //         <div
  //           key={device.id}
  //           className="flex justify-between items-center p-4 rounded-lg shadow-sm bg-gray-50 border border-gray-200 
  //                      hover:shadow-md transition cursor-pointer"
  //           onClick={() => setSelectedDevice(device.id)}
  //         >
  //           <div>
  //             <h3 className="font-semibold text-lg text-gray-700">{device.name}</h3>
  //             <p
  //               className={`text-sm font-medium ${
  //                 device.status === "Online" ? "text-green-500" : "text-red-500"
  //               }`}
  //             >
  //               🔵 Trạng thái: {device.status}
  //             </p>
  //           </div>

  //           <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">
  //             ❌ Xóa
  //           </button>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
};



export default DeviceList;
