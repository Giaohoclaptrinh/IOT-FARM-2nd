// import React, { useState } from "react";
// import DeviceList from "../components/Devices/DeviceList";
// import DeviceChart from "@/components/Devices/DeviceChart";
// import { useNavigate } from "react-router-dom";

// const Devices = () => {
//   const navigate = useNavigate();
//   const [selectedDevice, setSelectedDevice] = useState(null); // Lưu cả đối tượng thiết bị

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Quản lý Thiết bị</h1>

//       {/* Truyền setSelectedDevice vào DeviceList để cập nhật khi click vào thiết bị */}
//       <DeviceList setSelectedDevice={(device) => setSelectedDevice(device)} />

//       {/* Chỉ hiển thị biểu đồ nếu có thiết bị được chọn */}
//       {selectedDevice && (
//         <div className="mt-8 p-4 border rounded-lg shadow bg-white">
//           <h2 className="text-lg font-semibold">Dữ liệu thiết bị: {selectedDevice}</h2>
//           <DeviceChart deviceId={selectedDevice.id} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Devices;



import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase/db.config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import DeviceChart from "@/components/Devices/DeviceChart"; // Đảm bảo đã import đúng component biểu đồ
import HomeWrap from "./HomeWrap";

const Devices = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null); // Lưu đối tượng thiết bị đã chọn

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "devices"), where("userUID", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deviceList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDevices(deviceList);
    });

    return () => unsubscribe();
  }, []);

  const handleDeviceClick = (deviceUid) => {
    const device = devices.find(d => d.id === deviceUid); // Tìm thiết bị trong danh sách
    setSelectedDevice(device); // Cập nhật thiết bị đã chọn
    navigate(`/dashboards/${deviceUid}`); // Điều hướng đến trang Dashboard
  };

  return (
    <HomeWrap>
       <div className="p-4 w-full">
      <h2 className="text-xl font-bold">Danh sách thiết bị</h2>
      <ul>
        {devices.length > 0 ? (
          devices.map((device) => (
            <li
              key={device.id}
              className="p-2 border cursor-pointer hover:bg-gray-200"
              onClick={() => handleDeviceClick(device.id)}
            >
              {device.name || `Thiết bị ${device.id}`}
            </li>
          ))
        ) : (
          <li className="text-gray-500">Không có thiết bị nào</li>
        )}
      </ul>

      {/* Hiển thị biểu đồ nếu có thiết bị được chọn */}
      {selectedDevice && (
        <div className="mt-8 p-4 border rounded-lg shadow bg-white">
          <h2 className="text-lg font-semibold">Dữ liệu thiết bị: {selectedDevice.name}</h2>
          <DeviceChart deviceId={selectedDevice.id} /> {/* Biểu đồ cho thiết bị đã chọn */}
        </div>
      )}
    </div>
    </HomeWrap>
   
  );
};

export default Devices;
