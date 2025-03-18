// import React from "react";
import { auth } from "../firebase/db.config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/sign-in");
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-full p-6">
      <h1 className="text-xl font-bold mb-6">IoT-Farm</h1>
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 p-2 rounded hover:bg-red-600"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
