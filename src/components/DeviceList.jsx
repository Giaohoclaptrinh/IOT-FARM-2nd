import React, { useState, useEffect } from "react";

const DeviceList = () => {
  // Danh sách thiết bị (dữ liệu mẫu)
  const [devices, setDevices] = useState([]);

  // Giả lập dữ liệu từ API
  useEffect(() => {
    const fetchDevices = async () => {
      const fakeData = [
        { id: 1, name: "Cảm biến nhiệt độ", status: "Hoạt động" },
        { id: 2, name: "Cảm biến độ ẩm", status: "Lỗi" },
        { id: 3, name: "Máy bơm nước", status: "Tắt" },
      ];
      setDevices(fakeData);
    };

    fetchDevices();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách Thiết bị</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên Thiết Bị</th>
            <th className="border p-2">Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id} className="text-center">
              <td className="border p-2">{device.id}</td>
              <td className="border p-2">{device.name}</td>
              <td className="border p-2">{device.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceList;
