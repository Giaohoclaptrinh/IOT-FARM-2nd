import { useState } from "react";
import { db } from "../firebase/db.config"; // Kết nối Firebase
import { collection, addDoc } from "firebase/firestore";
import { Description } from "@mui/icons-material";

const AddDevice = ({ onClose }) => {
  const [deviceName, setDeviceName] = useState("");
  const [status, setStatus] = useState("Online");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false)
  const [description, setDesciption] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "devices"), {
        name: deviceName,
        status: status,
        createdAt: new Date(),
        location: location,
        description: description,
      });

      alert("Thiết bị đã được thêm!");
      onClose(); // Đóng form sau khi thêm thành công
    } catch (error) {
      console.error("Lỗi khi thêm thiết bị: ", error);
    } finally{
      setLoading(false);
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
            <input
            type="text"
            placeholder="Vị trí thiết bị"
            className="border p-2 w-full"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            />
            <input
            type="text"
            placeholder="Giới thiệu thiết bị"
            className="border p-2 w-full"
            value={description}
            onChange={(e) => setDesciption(e.target.value)}
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
          <button
          type="submit"
          className={`p-2 w-full ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
          } text-white`}
          disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu"}
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
