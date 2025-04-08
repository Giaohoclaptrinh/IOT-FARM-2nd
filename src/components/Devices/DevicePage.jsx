import React, { useEffect, useState } from "react";
import { fetchDevices } from "@/services/deviceService";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase/db.config";

const createPage = async (pageId) => {
  try {
    const docRef = doc(db, "things", pageId);
    await setDoc(docRef, { name: `Page ${pageId}`, createdAt: new Date() });
    console.log("Page created successfully!");
  } catch (error) {
    console.error("Error creating page:", error);
  }
};

const addDeviceToPage = async (pageId, device) => {
  try {
    const docRef = doc(db, `things/${pageId}/devices`, device.uid);
    await setDoc(docRef, { ...device, addedAt: new Date() });
    console.log(`Device ${device.uid} added successfully to ${pageId}`);
  } catch (error) {
    console.error("Error adding device:", error);
  }
};

const fetchLinkedDeviceUIDs = async (pageId) => {
  const snap = await getDocs(collection(db, `things/${pageId}/devices`));
  return snap.docs.map(doc => doc.id);
};

const DevicesPage = ({ pageId, onSelectDevice }) => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const getDevices = async () => {
      const allDevices = await fetchDevices();
      const linkedUIDs = await fetchLinkedDeviceUIDs(pageId);
      const unlinkedDevices = allDevices.filter(d => !linkedUIDs.includes(d.uid));
      setDevices(unlinkedDevices);
    };
    getDevices();
  }, [pageId]);

  const handleSelectDevice = async (deviceUid) => {
    const selectedDevice = devices.find(device => device.uid === deviceUid);
    if (selectedDevice) {
      await addDeviceToPage(pageId, selectedDevice);
      if (onSelectDevice) onSelectDevice(deviceUid);

      // Optionally cập nhật lại danh sách
      setDevices(prev => prev.filter(d => d.uid !== deviceUid));
    }
  };

  const handleCreatePage = async () => {
    if (!pageId) return;
    await createPage(pageId);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Devices in: {pageId}</h2>
        <button
          onClick={handleCreatePage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Tạo Page mới
        </button>
      </div>

      <ul className="space-y-2">
        {devices.map((device) => (
          <li
            key={device.uid}
            className="p-4 border rounded-lg shadow hover:bg-blue-50 cursor-pointer"
            onClick={() => handleSelectDevice(device.uid)}
          >
            <p className="font-semibold text-lg">{device.name || `Device ${device.uid}`}</p>
            <p className="text-sm text-gray-600">{device.description || "No description"}</p>
            <p className="text-xs text-gray-400">UID: {device.uid}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DevicesPage;
