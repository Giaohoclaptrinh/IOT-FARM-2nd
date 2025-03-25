import React, { useState } from "react";
import { db } from "../firebase/db.config";
import { doc, updateDoc } from "firebase/firestore";
import { Description } from "@mui/icons-material";

const EditDevice = ({ device, onClose }) => {
  const [name, setName] = useState(device.name || "");
  const [location, setLocation] = useState(device.location || "");
  const [status, setStatus] = useState(device.status || "Offline");
  const [description, setDescription] = useState(device.description || "");
  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "devices", device.id), {
        name,
        location,
        description,
        status,
      });
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật thiết bị:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa thiết bị</h2>
        <input 
          className="border p-2 rounded w-full mb-2" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Tên thiết bị"
        />
        <input 
          className="border p-2 rounded w-full mb-2" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          placeholder="Vị trí"
        />
        <input 
          className="border p-2 rounded w-full mb-4" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
        ></input>
        <select 
          className="border p-2 rounded w-full mb-4" 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
        <div className="flex justify-between">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleUpdate}>Lưu</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default EditDevice;
