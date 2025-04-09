import React, { useEffect, useState } from "react";
import {
  getDevicesNotInPage,
  getDevicesInPage,
  addDeviceToPage,
  removeDeviceFromPage
} from "@/utils/FireStoreUtils";
import { auth } from "@/firebase/db.config";

const PageDetail = ({ pageId, onBack }) => {
  const [linkedDevices, setLinkedDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const [inPage, notInPage] = await Promise.all([
      getDevicesInPage(pageId),
      getDevicesNotInPage(pageId)
    ]);
    setLinkedDevices(inPage);
    setAvailableDevices(notInPage);
  };

  useEffect(() => {
    fetchData();
  }, [pageId]);

  const handleAdd = async (device) => {
    await addDeviceToPage(pageId, device);
    fetchData();
  };

  const handleRemove = async (uid) => {
    await removeDeviceFromPage(pageId, uid);
    fetchData();
  };

  return (
    <div>
      <button onClick={onBack} className="mb-4 text-blue-500">← Quay lại</button>
      <h2 className="text-xl font-semibold mb-2">Thiết bị trong Page {pageId}</h2>
      <ul className="mb-4">
        {linkedDevices.map(device => (
          <li key={device.uid} className="flex justify-between bg-slate-100 p-2 rounded mb-2">
            {device.name}
            <button onClick={() => handleRemove(device.uid)} className="text-red-500">Xoá</button>
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-medium">Thêm thiết bị</h3>
      <ul>
        {availableDevices.map(device => (
          <li key={device.uid} className="flex justify-between bg-green-50 p-2 rounded mb-2">
            {device.name}
            <button onClick={() => handleAdd(device)} className="text-green-600">Thêm</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageDetail;
