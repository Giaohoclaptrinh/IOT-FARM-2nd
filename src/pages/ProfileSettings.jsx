import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/db.config"; // Import Firebase
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";

const ProfileSettings = () => {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [newName, setNewName] = useState("");
//   const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const user = auth.currentUser; // Lấy user hiện tại

  // Lấy dữ liệu từ Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setNewName(userSnap.data().name); // Điền tên vào ô input
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Cập nhật tên người dùng
  const handleChangeName = async () => {
    if (!newName.trim()) {
      alert("Tên không được để trống!");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name: newName });

      setUserData((prev) => ({ ...prev, name: newName }));
      alert("Tên đã được cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật tên:", error);
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    try {
      await updatePassword(user, newPassword);
      alert("Mật khẩu đã được thay đổi thành công!");
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      alert("Lỗi đổi mật khẩu: " + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Cài đặt hồ sơ</h2>

      {/* Email (Chỉ xem) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Email</label>
        <input
          type="email"
          value={userData.email}
          readOnly
          className="w-full p-2 border rounded mt-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Cập nhật tên */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Tên hiển thị</label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        />
        <button
          onClick={handleChangeName}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Cập nhật tên
        </button>
      </div>

      {/* Đổi mật khẩu */}
      <div>
        <label className="block text-gray-700 font-semibold mt-4">Mật khẩu mới</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        />

        <label className="block text-gray-700 font-semibold mt-4">Xác nhận mật khẩu mới</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        />

        <button
          onClick={handleChangePassword}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Đổi mật khẩu
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
