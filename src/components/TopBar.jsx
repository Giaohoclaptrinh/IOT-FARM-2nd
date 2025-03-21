import React, { useEffect, useState } from "react";
import { auth } from "../firebase/db.config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/db.config"; 

const TopBar = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true); // Thêm state loading
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);

      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserName(userDocSnap.data().name || "Người dùng");
          } else {
            setUserName("Người dùng");
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          setUserName("Người dùng");
        }
      } else {
        setUserName(""); // Không có user thì reset lại tên
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border rounded-lg px-3 py-2 w-64"
        />
      </div>

      {loading ? (
        <span className="text-gray-500">Đang tải...</span>
      ) : user ? (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">👤 {userName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/sign-in")}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
        >
          Đăng nhập
        </button>
      )}
    </div>
  );
};

export default TopBar;
