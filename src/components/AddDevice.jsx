import { useState } from "react";
import { db } from "../firebase/db.config"; // Kết nối Firebase
import { collection, addDoc } from "firebase/firestore";

const AddDevice = ({ onClose }) => {
  const [deviceName, setDeviceName] = useState("");
  const [status, setStatus] = useState("Online");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "devices"), {
        name: deviceName,
        status: status,
        createdAt: new Date(),
      });

      alert("Thiết bị đã được thêm!");
      onClose(); // Đóng form sau khi thêm thành công
    } catch (error) {
      console.error("Lỗi khi thêm thiết bị: ", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Thêm thiết bị mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Tên thiết bị"
            className="border p-2 w-full"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            required
          />
          <select
            className="border p-2 w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 w-full">
            Lưu
          </button>
        </form>
        <button className="mt-4 text-gray-500" onClick={onClose}>
          Hủy
        </button>
      </div>
    </div>
  );
};

export default AddDevice;
