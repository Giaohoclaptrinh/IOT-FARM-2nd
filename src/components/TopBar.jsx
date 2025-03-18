import React from "react";

const TopBar = () => {
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
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">👤 Admin</span>
        <button className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600">
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default TopBar;
