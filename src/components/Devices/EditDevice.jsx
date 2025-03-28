import React, { useState } from "react";
import { db } from "@/firebase/db.config";
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
  <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
    <h2 className="text-2xl font-bold mb-6">Chỉnh sửa thiết bị</h2>

    <label className="block text-lg font-medium mb-1">Tên Thiết bị</label>
    <input 
      className="border p-3 rounded w-full mb-3 text-lg" 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
      placeholder="Tên thiết bị"
    />

    <label className="block text-lg font-medium mb-1">Mô tả</label>
    <input 
      className="border p-3 rounded w-full mb-3 text-lg" 
      value={description} 
      onChange={(e) => setDescription(e.target.value)}
    />

    <label className="block text-lg font-medium mb-1">Vị Trí</label>
    <input 
      className="border p-3 rounded w-full mb-3 text-lg" 
      value={location} 
      onChange={(e) => setLocation(e.target.value)} 
      placeholder="Vị trí"
    />

    <label className="block text-lg font-medium mb-1">Tình trạng</label>
    <select 
      className="border p-3 rounded w-full mb-4 text-lg"
      value={status} 
      onChange={(e) => setStatus(e.target.value)}
    >
      <option value="Online">Online</option>
      <option value="Offline">Offline</option>
    </select>

    <div className="flex justify-between">
      <button className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700" onClick={handleUpdate}>Lưu</button>
      <button className="bg-gray-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-700" onClick={onClose}>Hủy</button>
    </div>
  </div>
</div>
  );
};

export default EditDevice;
