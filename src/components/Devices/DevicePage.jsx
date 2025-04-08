import React, { useEffect, useState } from "react";
import { fetchDevices } from "@/services/deviceService";
import { setDoc, doc } from "firebase/firestore";
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

const DevicesPage = ({ pageId, onSelectDevice }) => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const getDevices = async () => {
      const data = await fetchDevices(pageId);
      setDevices(data);
    };
    getDevices();
  }, [pageId]);

  const handleSelectDevice = async (deviceUid) => {
    onSelectDevice(deviceUid);

    const selectedDevice = devices.find(device => device.uid === deviceUid);
    if (selectedDevice) {
      await addDeviceToPage(pageId, selectedDevice);
    }
  };

  const handleCreatePage = async () => {
    if (!pageId) return; 
    await createPage(pageId); 
  };

  return (
    <div>
      <h2>Devices in {pageId}</h2>
      
      <button
        onClick={handleCreatePage}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Tạo Page mới
      </button>

      <ul>
        {devices.map((device) => (
          <li key={device.uid} onClick={() => handleSelectDevice(device.uid)}>
            Device {device.uid}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DevicesPage;
