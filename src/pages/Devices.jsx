import React from "react";
import DeviceList from "../components/DeviceList";

const Devices = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý Thiết bị</h1>
      <DeviceList />
    </div>
  );
};

export default Devices;
