import React, { useState } from "react";
import DeviceList from "../components/DeviceList";
import DeviceChart from "@/components/DeviceChart";

const Devices = () => {
  const [selectedDevice, setSelectedDevice] = useState(null); // Lưu cả đối tượng thiết bị

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý Thiết bị</h1>

      {/* Truyền setSelectedDevice vào DeviceList để cập nhật khi click vào thiết bị */}
      <DeviceList setSelectedDevice={(device) => setSelectedDevice(device)} />

      {/* Chỉ hiển thị biểu đồ nếu có thiết bị được chọn */}
      {selectedDevice && (
        <div className="mt-8 p-4 border rounded-lg shadow bg-white">
          <h2 className="text-lg font-semibold">Dữ liệu thiết bị: {selectedDevice}</h2>
          <DeviceChart deviceId={selectedDevice.id} />
        </div>
      )}
    </div>
  );
};

export default Devices;
