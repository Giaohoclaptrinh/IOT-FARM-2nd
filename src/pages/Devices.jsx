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
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import DeviceChart from "@/components/Devices/DeviceChart";
import HomeWrap from "./HomeWrap";
import EditDevice from "@/components/Devices/EditDevice";

const Devices = () => {
  const navigate = useNavigate();
  const [deviceData, setDeviceData] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Theo dõi người dùng hiện tại
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Lấy danh sách thiết bị
  useEffect(() => {
    if (!currentUser) return;

    const deviceRef = collection(db, "devices");
    const isAdmin = currentUser.email === "1@gmail.com"; // ⚠️ ⚠️⚠️⚠️đổi thành email admin 

    const q = isAdmin
      ? deviceRef
      : query(deviceRef, where("userUID", "==", currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDeviceData(snapshot.docs);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDeleteDevice = async (id) => {
    const confirm = window.confirm("Bạn có chắc muốn xoá thiết bị này?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "devices", id));
      setDeviceData((prev) => prev.filter((device) => device.id !== id));
    } catch (error) {
      console.error("Lỗi khi xoá thiết bị:", error);
    }
  };

  return (
    <HomeWrap>
      <div className="font-seconds border rounded-md">
        <table className="table-auto border-collapse divide-y relative text-left w-full">
          <thead>
            <tr className="bg-slate-200 font-semibold text-md">
              <th className="py-2 rounded-tl-md">Name Device</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
              <th className="py-2 rounded-tr-md"></th>
            </tr>
          </thead>
          <tbody>
            {deviceData.map((item) => {
              const data = item.data();
              const createdAt = data.createdAt?.toDate();
              const formattedDate = createdAt
                ? `${createdAt.getDate()}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`
                : "N/A";

              return (
                <tr key={item.id} className="border-b last:border-none">
                  <td className="font-bold">{data.name}</td>
                  <td className="text-gray-600">{formattedDate}</td>
                  <td className="text-gray-600">{data.status}</td>
                  <td className="text-gray-600 py-2 space-x-2">
                    <button
                      className="bg-blue-400 px-4 rounded-md text-white"
                      onClick={() =>
                        setSelectedDevice({ id: item.id, ...data })
                      }
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 px-4 rounded-md text-white"
                      onClick={() => handleDeleteDevice(item.id)}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedDevice && (
        <EditDevice
          device={selectedDevice}
          onClose={() => {
            setSelectedDevice(null);
          }}
        />
      )}
    </HomeWrap>
  );
};

export default Devices;
