import React, { useEffect, useState } from "react";
import { auth } from "../firebase/db.config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/db.config"; // Đảm bảo bạn đã import db từ firebase

const TopBar = () => {
  const [user, setUser ] = useState(null);
  const [userName, setUserName] = useState(""); // Thêm state để lưu tên người dùng
  const navigate = useNavigate();

  // Lắng nghe trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser ) => {
      setUser (currentUser );
      if (currentUser ) {
        // Lấy thông tin người dùng từ Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser .uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name); // Lưu tên người dùng vào state
        }
      } else {
        setUserName(""); // Nếu không có người dùng, đặt tên là rỗng
      }
    });
    return () => unsubscribe();
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in"); // Chuyển hướng về trang đăng nhập
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Tiêu đề */}
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

      {/* Ô tìm kiếm */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border rounded-lg px-3 py-2 w-64"
        />
      </div>

      {/* Thông tin người dùng */}
      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">👤 {userName || "Người dùng"}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <span className="text-gray-500">Chưa đăng nhập</span>
      )}
    </div>
  );
};

export default TopBar;