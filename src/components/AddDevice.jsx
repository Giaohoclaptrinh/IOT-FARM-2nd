import { useState, useEffect } from "react";
import { db, auth } from "../firebase/db.config"; // Thêm auth để lấy user
import { collection, addDoc } from "firebase/firestore";

const AddDevice = ({ onClose, onDeviceAdded }) => {
  const [deviceName, setDeviceName] = useState("");
  const [status, setStatus] = useState("Online");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Bạn cần đăng nhập để thêm thiết bị!");
      return;
    }
  
    if (!deviceName.trim() || !location.trim() || !description.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
  
    setLoading(true);
    try {
      await addDoc(collection(db, "devices"), {
        name: deviceName.trim(),
        status,
        location: location.trim(),
        description: description.trim(),
        userUID: user.uid,
        createdAt: new Date(),
      });
  
      alert("Thiết bị đã được thêm thành công!");
  
      onDeviceAdded(); // Gọi callback cập nhật danh sách
    } catch (error) {
      console.error("Lỗi khi thêm thiết bị:", error);
    } finally {
      setLoading(false);
      onClose(); // Đóng form
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
            onChange={(e) => setDescription(e.target.value)}
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
            className={`p-2 w-full text-white ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </form>
        <button type="button" className="mt-4 text-gray-500" onClick={onClose}>
          Hủy
        </button>
      </div>
    </div>
  );
};

export default AddDevice;
